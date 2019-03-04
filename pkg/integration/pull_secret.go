package integration

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

const authTokenRequestURL = "https://developers.redhat.com/auth/realms/rhd/protocol/openid-connect/token"
const pullSecretRequestURL = "https://api.openshift.com/api/accounts_mgmt/v1/access_token"

type DeveloperTokenResponse struct {
	ExpiresIn        int    `json:"expires_in"`
	RefreshExpiresIn int    `json:"refresh_expires_in"`
	RefreshToken     string `json:"refresh_token"`
	TokenType        string `json:"token_type"`
	NotBeforePolicy  int    `json:"not-before-policy"`
	SessionState     string `json:"session_state"`
	AccessToken      string `json:"access_token"`
}

type DeveloperTokenErrorReponse struct {
	Error            string `json:"error"`
	ErrorDescription string `json:"error_description"`
}

type PullSecretErrorResponse struct {
	ID     string `json:"id"`
	Kind   string `json:"kind"`
	Href   string `json:"href"`
	Code   string `json:"code"`
	Reason string `json:"reason"`
}

func FetchAuthToken(username string, password string) (tokenData DeveloperTokenResponse, err error) {
	resp, err := http.PostForm(authTokenRequestURL, url.Values{
		"grant_type": {"password"},
		"client_id":  {"uhc"},
		"username":   {username},
		"password":   {password},
	})
	if err != nil {
		return tokenData, err
	}

	if resp.StatusCode != 200 {
		var errorData DeveloperTokenErrorReponse
		err = json.NewDecoder(resp.Body).Decode(&errorData)
		if err != nil {
			return tokenData, err
		}
		return tokenData, fmt.Errorf("%s: %s", resp.Status, errorData.ErrorDescription)
	}

	err = json.NewDecoder(resp.Body).Decode(&tokenData)
	if err != nil {
		return tokenData, err
	}

	return tokenData, nil
}

func FetchPullSecret(tokenData DeveloperTokenResponse) (pullSecret map[string]interface{}, err error) {
	req, err := http.NewRequest("POST", pullSecretRequestURL, nil)
	req.Header.Add("accept", "application/json")
	req.Header.Add("authorization", "bearer "+tokenData.AccessToken)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return pullSecret, err
	}

	if resp.StatusCode != 200 {
		var errorData PullSecretErrorResponse
		err = json.NewDecoder(resp.Body).Decode(&errorData)
		if err != nil {
			return pullSecret, err
		}
		return pullSecret, fmt.Errorf("%s: %s", resp.Status, errorData.Reason)
	}

	err = json.NewDecoder(resp.Body).Decode(&pullSecret)
	if err != nil {
		return pullSecret, err
	}

	return pullSecret, nil
}
