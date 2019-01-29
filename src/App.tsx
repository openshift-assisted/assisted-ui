import React, { Component, Fragment } from 'react';
import {
  BackgroundImage,
  BackgroundImageSrc,
  Button,
  Page,
  PageSection,
  PageSectionVariants,
  StackItem,
  TextContent,
  Text
} from '@patternfly/react-core';

import Header from './Header';

const bgImages = {
  [BackgroundImageSrc.lg]:
    '@patternfly/patternfly-next/assets/images/pfbg_1200.jpg',
  [BackgroundImageSrc.sm]:
    '@patternfly/patternfly-next/assets/images/pfbg_768.jpg',
  [BackgroundImageSrc.sm2x]:
    '@patternfly/patternfly-next/assets/images/pfbg_768@2x.jpg',
  [BackgroundImageSrc.xs]:
    '@patternfly/patternfly-next/assets/images/pfbg_576.jpg',
  [BackgroundImageSrc.xs2x]:
    '@patternfly/patternfly-next/assets/images/pfbg_576@2x.jpg',
  [BackgroundImageSrc.filter]:
    '@patternfly/patternfly-next/assets/images/background-filter.svg#image_overlay'
};

class App extends Component {
  render(): React.ReactNode {
    return (
      <Fragment>
        <BackgroundImage src={bgImages} />
        <Page header={<Header />}>
          <StackItem isMain={false}>
            <PageSection variant={PageSectionVariants.light}>
              <TextContent>
                <Text component="h1">
                  Deploy Bare Metal Hyper Converged Cluster
                </Text>
                <Text component="p">Wizard steps go here</Text>
              </TextContent>
            </PageSection>
          </StackItem>
          <StackItem isMain style={{ position: 'relative' }}>
            <PageSection
              style={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                overflow: 'auto',
                zIndex: 0
              }}
              variant={PageSectionVariants.default}
            >
              <TextContent>
                <Text component="h2" style={{ position: 'sticky', top: -32 }}>
                  Baremetal Node Inventory
                </Text>
                <Text component="p">
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form, by injected humour, or randomised words which don't look
                  even slightly believable. If you are going to use a passage of
                  Lorem Ipsum, you need to be sure there isn't anything
                  embarrassing hidden in the middle of text. All the Lorem Ipsum
                  generators on the Internet tend to repeat predefined chunks as
                  necessary, making this the first true generator on the
                  Internet. It uses a dictionary of over 200 Latin words,
                  combined with a handful of model sentence structures, to
                  generate Lorem Ipsum which looks reasonable. The generated
                  Lorem Ipsum is therefore always free from repetition, injected
                  humour, or non-characteristic words etc.
                </Text>
                <Text component="p">
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form, by injected humour, or randomised words which don't look
                  even slightly believable. If you are going to use a passage of
                  Lorem Ipsum, you need to be sure there isn't anything
                  embarrassing hidden in the middle of text. All the Lorem Ipsum
                  generators on the Internet tend to repeat predefined chunks as
                  necessary, making this the first true generator on the
                  Internet. It uses a dictionary of over 200 Latin words,
                  combined with a handful of model sentence structures, to
                  generate Lorem Ipsum which looks reasonable. The generated
                  Lorem Ipsum is therefore always free from repetition, injected
                  humour, or non-characteristic words etc.
                </Text>
                <Text component="p">
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form, by injected humour, or randomised words which don't look
                  even slightly believable. If you are going to use a passage of
                  Lorem Ipsum, you need to be sure there isn't anything
                  embarrassing hidden in the middle of text. All the Lorem Ipsum
                  generators on the Internet tend to repeat predefined chunks as
                  necessary, making this the first true generator on the
                  Internet. It uses a dictionary of over 200 Latin words,
                  combined with a handful of model sentence structures, to
                  generate Lorem Ipsum which looks reasonable. The generated
                  Lorem Ipsum is therefore always free from repetition, injected
                  humour, or non-characteristic words etc.
                </Text>
                <Text component="p">
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form, by injected humour, or randomised words which don't look
                  even slightly believable. If you are going to use a passage of
                  Lorem Ipsum, you need to be sure there isn't anything
                  embarrassing hidden in the middle of text. All the Lorem Ipsum
                  generators on the Internet tend to repeat predefined chunks as
                  necessary, making this the first true generator on the
                  Internet. It uses a dictionary of over 200 Latin words,
                  combined with a handful of model sentence structures, to
                  generate Lorem Ipsum which looks reasonable. The generated
                  Lorem Ipsum is therefore always free from repetition, injected
                  humour, or non-characteristic words etc.
                </Text>
                <Text component="p">
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form, by injected humour, or randomised words which don't look
                  even slightly believable. If you are going to use a passage of
                  Lorem Ipsum, you need to be sure there isn't anything
                  embarrassing hidden in the middle of text. All the Lorem Ipsum
                  generators on the Internet tend to repeat predefined chunks as
                  necessary, making this the first true generator on the
                  Internet. It uses a dictionary of over 200 Latin words,
                  combined with a handful of model sentence structures, to
                  generate Lorem Ipsum which looks reasonable. The generated
                  Lorem Ipsum is therefore always free from repetition, injected
                  humour, or non-characteristic words etc.
                </Text>
                <Text component="p">
                  There are many variations of passages of Lorem Ipsum
                  available, but the majority have suffered alteration in some
                  form, by injected humour, or randomised words which don't look
                  even slightly believable. If you are going to use a passage of
                  Lorem Ipsum, you need to be sure there isn't anything
                  embarrassing hidden in the middle of text. All the Lorem Ipsum
                  generators on the Internet tend to repeat predefined chunks as
                  necessary, making this the first true generator on the
                  Internet. It uses a dictionary of over 200 Latin words,
                  combined with a handful of model sentence structures, to
                  generate Lorem Ipsum which looks reasonable. The generated
                  Lorem Ipsum is therefore always free from repetition, injected
                  humour, or non-characteristic words etc.
                </Text>
              </TextContent>
            </PageSection>
          </StackItem>
          <StackItem isMain={false}>
            <PageSection variant={PageSectionVariants.light}>
              <Button variant="primary">Next</Button>
            </PageSection>
          </StackItem>
        </Page>
      </Fragment>
    );
  }
}

export default App;
