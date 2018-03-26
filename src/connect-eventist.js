import React, { Component } from 'react';
import PropTypes from 'prop-types';
import eachSeries from 'async/eachSeries';

const defaultSettings = {
  eventistKey: 'eventist',
  mapInProgressToProps: (inPre, inEvent, inPost) => (
    inPre || inEvent || inPost ? { inProgress: true } : { inProgress: false }
  ),
};

function connectEventist(WrappedComponent, handler, settings = {}) {

  settings.eventistKey = settings.eventistKey || defaultSettings.eventistKey;
  settings.mapInProgressToProps = settings.mapInProgressToProps
      || defaultSettings.mapInProgressToProps;

  class ConnectEventist extends Component {

    constructor(props, context) {
      super(props, context);
      this.state = {
        inPre: false,
        inPost: false,
      };
    }

    process(actions, event, props, callback) {
      eachSeries(actions, (action, next) => {
        action(event, props, next);
      }, callback);
    }

    handle(event) {
      const { pre, post } = this.context[settings.eventistKey];
      this.setState({ inPre: true  });
      this.process(pre, event, this.props, () => {
        this.setState({ inPre: false, inEvent: true });
        this.props[handler](event);
        this.setState({ inEvent: false, inPost: true });
        this.process(post, event, this.props);
        this.setState({ inPost: false });
      });
    }

    render() {
      const { inPre, inEvent, inPost } = this.state;
      const eventize = { [handler]: this.handle.bind(this), };
      const inProgress = settings.mapInProgressToProps(inPre, inEvent, inPost);
      return (
        <WrappedComponent
          {...this.props}
          {...inProgress}
          {...eventize}
        />
      );
    }

  }

  ConnectEventist.contextTypes = {
    [settings.eventistKey]: PropTypes.object,
  }

  return ConnectEventist;

};

export default connectEventist;
