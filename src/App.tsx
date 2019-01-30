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

import pfbg1200 from '@patternfly/patternfly-next/assets/images/pfbg_1200.jpg';
import pfbg768 from '@patternfly/patternfly-next/assets/images/pfbg_768.jpg';
import pfbg768at2x from '@patternfly/patternfly-next/assets/images/pfbg_768@2x.jpg';
import pfbg576 from '@patternfly/patternfly-next/assets/images/pfbg_576.jpg';
import pfbg576at2x from '@patternfly/patternfly-next/assets/images/pfbg_576@2x.jpg';
import pfbgBackgroundFilter from '@patternfly/patternfly-next/assets/images/background-filter.svg';

const bgImages = {
  [BackgroundImageSrc.lg]: pfbg1200,
  [BackgroundImageSrc.sm]: pfbg768,
  [BackgroundImageSrc.sm2x]: pfbg768at2x,
  [BackgroundImageSrc.xs]: pfbg576,
  [BackgroundImageSrc.xs2x]: pfbg576at2x,
  [BackgroundImageSrc.filter]: pfbgBackgroundFilter
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
