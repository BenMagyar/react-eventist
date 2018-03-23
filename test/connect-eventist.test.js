import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Eventist, createEventist, connectEventist } from '../src';
import TestUtils from 'react-dom/test-utils';

describe('connectEventist', () => {

  const propClient = (props) => (<div {...props} />);

  it('should receive the actions in the context', () => {
    const WithEventist = connectEventist(propClient, 'onClick');
    const tree = TestUtils.renderIntoDocument(
      <Eventist>
        <WithEventist />
      </Eventist>
    );
    const client = TestUtils.findRenderedComponentWithType(tree, WithEventist);
    expect(client.context.eventist).toEqual({ pre: [], post: [], });
  });

  it('should connect to custom context keys', () => {
    const CustomEventist = createEventist('eventor');
    const WithCustomEventist = connectEventist(
      propClient, 'onClick', { eventistKey: 'eventor' }
    );
    const tree = TestUtils.renderIntoDocument(
      <CustomEventist>
        <WithCustomEventist />
      </CustomEventist>
    );
    const client = TestUtils.findRenderedComponentWithType(
      tree, WithCustomEventist
    );
    expect(client.context.eventor).toEqual({ pre: [], post: [], });
  });

});
