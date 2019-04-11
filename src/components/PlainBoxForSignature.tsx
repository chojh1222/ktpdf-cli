import * as React from "react";
import { SignInput } from "src/interface/Input";
import { IconContext } from "react-icons";
import { FaStamp } from "react-icons/fa";

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
    controlSignLayer(boxIndex);
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
      // backgroundColor: '#fff',
      // opacity: 0.7,
      backgroundColor: 'transparent',
      opacity: 1,
      border: 'dotted 1.5px black',
    }

    const stampicon = {
      color: '#FF4136', 
      className: "global-class-name", 
      size: "80%",
      padding: 0,
      margin: 0,
      
      // width: '100%',
      // height: '100%',
      style: {
        opacity: 0.7,
        // position: 'absolute',
      },
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
          : <IconContext.Provider value={stampicon}>
            <FaStamp />
          </IconContext.Provider>
        }
      </div>
    );
  }
}

export default PlainBoxForSignature;
