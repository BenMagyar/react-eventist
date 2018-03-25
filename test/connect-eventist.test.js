import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TestUtils from 'react-dom/test-utils';
import { mount } from 'enzyme';
import { Eventist, createEventist, connectEventist } from '../src';

describe('connectEventist', () => {

  const propClient = (props) => (<button {...props} />);

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

  it('should call the pre actions on an action', () => {
    const WithEventist = connectEventist(propClient, 'onClick');
    const preFn = jest.fn().mockImplementation((e, props, next) => { next(); });
    const wrapper = mount(
      <Eventist pre={[preFn]}>
        <WithEventist onClick={() => {}} foo='bar' />
      </Eventist>
    );
    wrapper.find(WithEventist).simulate('click');
    expect(preFn).toHaveBeenCalledWith(
      expect.any(Object),
      { foo: 'bar', onClick: expect.any(Function) },
      expect.any(Function)
    );
  });

  it('should call the post actions', () => {
    const WithEventist = connectEventist(propClient, 'onClick');
    const postFn = jest.fn().mockImplementation((e, props, next) => { next(); });
    const wrapper = mount(
      <Eventist post={[postFn]}>
        <WithEventist onClick={() => {}} foo='bar' />
      </Eventist>
    );
    wrapper.find(WithEventist).simulate('click');
    expect(postFn).toHaveBeenCalledWith(
      expect.any(Object),
      { foo: 'bar', onClick: expect.any(Function) },
      expect.any(Function)
    );
  });

  it('should call the main event handler', () => {
    const WithEventist = connectEventist(propClient, 'onClick');
    const handler = jest.fn();
    const wrapper = mount(
      <Eventist>
        <WithEventist onClick={handler} />
      </Eventist>
    );
    wrapper.find(WithEventist).simulate('click');
    expect(handler).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should call all functions in the expected order', () => {
    const orderCalled = [];
    const makeAction = (name) => jest.fn()
      .mockImplementation((event, props = null, next = null) => {
        orderCalled.push(name);
        if (next) { next(); }
      });
    const order = [
      makeAction('preOne'),
      makeAction('preTwo'),
      makeAction('handler'),
      makeAction('postOne'),
      makeAction('postTwo'),
    ];

    const WithEventist = connectEventist(propClient, 'onClick');
    const wrapper = mount(
      <Eventist pre={[order[0], order[1]]} post={[order[3], order[4]]}>
        <WithEventist onClick={order[2]} />
      </Eventist>
    );
    wrapper.find(WithEventist).simulate('click');
    expect(orderCalled).toEqual([
      'preOne',
      'preTwo',
      'handler',
      'postOne',
      'postTwo',
    ]);
  });

});
