import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Eventist, createEventist } from '../src';
import TestUtils from 'react-dom/test-utils';

describe('Eventist', () => {

  describe('children', () => {

    it('should not error if one child element is provided', () => {
      expect(() => TestUtils.renderIntoDocument(
        <Eventist pre={[]} post={[]}>
          <div />
        </Eventist>
      )).not.toThrow();
    });

    it('should error if no child element is provided', () => {
      expect(() => TestUtils.renderIntoDocument(
        <Eventist pre={[]} post={[]} />
      )).toThrow();
    });

    it('should error if more than one child element is provided', () => {
      expect(() => TestUtils.renderIntoDocument(
        <Eventist pre={[]} post={[]}>
          <div />
          <div />
        </Eventist>
      )).toThrow();
    });

  });

  describe('context', () => {

    const props = { pre: [() => {}], post: [() => {}], };
    class Child extends Component { render() { return (<div />); } }
    Child.contextTypes = {
      'eventist': PropTypes.object,
      // used for custom context creation
      'eventor': PropTypes.object,
    }

    it('should setup the react context', () => {
      const tree = TestUtils.renderIntoDocument(
        <Eventist {...props}>
          <Child />
        </Eventist>
      );
      const child = TestUtils.findRenderedComponentWithType(tree, Child);
      expect(child.context.eventist).toEqual(props);
    });

    it('should setup default pre/post if none is provided', () => {
      const tree = TestUtils.renderIntoDocument(
        <Eventist>
          <Child />
        </Eventist>
      );
      const child = TestUtils.findRenderedComponentWithType(tree, Child);
      expect(child.context.eventist).toEqual({ pre: [], post: [], });
    });

    it('should allow for a custom context key through createEventist', () => {
      const CustomEventist = createEventist('eventor');
      const tree = TestUtils.renderIntoDocument(
        <CustomEventist>
          <Child />
        </CustomEventist>
      );
      const child = TestUtils.findRenderedComponentWithType(tree, Child);
      expect(child.context.eventor).toEqual({ pre: [], post: [], });
    });

  });

});
