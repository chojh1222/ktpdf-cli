import * as React from "react";
import { SignInput } from "src/interface/Input";

interface IBoxForSignatureProps {
  input: SignInput;
  controlSignLayer: (...args) => void;
  boxIndex: number;
  editable: boolean;
  scale: number;
}

class PlainBoxForSignature extends React.Component<IBoxForSignatureProps, React.ComponentState> {

  constructor(props) {
    super(props);

    this.showSignatureLayer = this.showSignatureLayer.bind(this);
  }

  showSignatureLayer() {
    const { boxIndex, controlSignLayer } = this.props;
    // controlSignLayer(boxIndex);
  }

  doNothing = () => {

  }

  render() {
    let {
      w,
      h,
      x,
      y,
      signUrl,
    } = this.props.input;

    const {editable, scale} = this.props;

    x *= scale;
    y *= scale;
    w *= scale;
    h *= scale;

    const nonEditableStyle = {
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,

      border: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.0)',
    };

    const editableStyle = {
      ...nonEditableStyle,
      // border: '1px solid #000',
      backgroundColor: '#fff',
      opacity: 0.7,
      border: 'dotted 2px black',
    }

    return (
      <div
        style={editable ? editableStyle : nonEditableStyle}
        onClick={editable ? this.showSignatureLayer : this.doNothing}
      >
        {signUrl
          ? <img
            src={signUrl}
            alt={'서명'}  
            width={`${w}px`}
            height={`${h}px`}
          />
          // : <span>{name} signature</span>
          : <span></span>
        }
      </div>
    );
  }
}

export default PlainBoxForSignature;
