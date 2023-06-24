import React, { PureComponent } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Animated,
  Dimensions,
  PanResponder
} from 'react-native';

let FULL_HEIGHT = Dimensions.get('window').height;
let PAN = new Animated.ValueXY({ x: 0, y: FULL_HEIGHT });
let panResponder;

export default class Component extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      panelHeight: 0
    }
    panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        PAN.setValue({
          x: 0,
          y: gestureState.dy > 0 ? gestureState.dy : 0,
        });
        if (gestureState.dy > this.state.panelHeight) {
          this.props.close();
        }
      },
      onPanResponderRelease: () => {
        PAN.flattenOffset();
        Animated.spring(PAN, {
          toValue: { x: 0, y: 0 },
          tension: 80,
          friction: 25,
          useNativeDriver: true,
          restDisplacementThreshold: 10,
          restSpeedThreshold: 10,
        }).start();
      }
    });
  }

  orientationChange = () => {
    FULL_HEIGHT = Dimensions.get('window').height;
    PAN = new Animated.ValueXY({ x: 0, y: FULL_HEIGHT });
  };

  componentDidMount = () => {
    if (this.props.show) {
      Animated.spring(PAN, {
        toValue: { x: 0, y: 0 },
        tension: 80,
        friction: 25,
        useNativeDriver: true,
        restDisplacementThreshold: 10,
        restSpeedThreshold: 10,
      }).start();
    }
    Dimensions.addEventListener('change', this.orientationChange);
  };

  componentDidUpdate() {
    if (this.props.show) {
      Animated.spring(PAN, {
        toValue: { x: 0, y: 0 },
        tension: 80,
        friction: 25,
        useNativeDriver: true,
        restDisplacementThreshold: 10,
        restSpeedThreshold: 10,
      }).start();
    }
  };

  render() {
    return this.props.show ? (
      <Animated.View
        style={[styles.panel, { backgroundColor: this.props.panelBackgroundColor ? this.props.panelBackgroundColor : 'white', shadowColor: this.props.panelShadowColor ? this.props.panelShadowColor : '#000000' }]}
        {...panResponder.panHandlers}
        onLayout={(event) => this.setState({ panelHeight: event.nativeEvent.layout.height })}
      >
        <View style={styles.barContainer}>
          <View style={[styles.bar, { backgroundColor: this.props.panelBarColor ? this.props.panelBarColor : '#e2e2e2' }]} />
        </View>
        <ScrollView
          onTouchStart={() => {
            return false;
          }}
          onTouchEnd={() => {
            return false;
          }}
          contentContainerStyle={{ width: '100%' }}>
          {this.props.children}
        </ScrollView>
      </Animated.View>
    ) : null;
  }
}

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    maxHeight: FULL_HEIGHT / 2,
    width: '100%',
    transform: PAN.getTranslateTransform(),
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    zIndex: 2
  },
  barContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bar: {
    width: '10%',
    height: 5,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  }
});