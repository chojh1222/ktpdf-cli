import * as React from "react";
import {IoMdCheckmark} from 'react-icons/io';
import { IconContext } from "react-icons";
import { CheckInput } from "src/interface/Input";

interface IBoxForCheckboxProps {
  input: CheckInput;
  updateTextArea: (...args) => void;
  boxIndex: number;
  editable: boolean;
  scale: number;
}

class PlainBoxForCheckbox extends React.Component<IBoxForCheckboxProps, React.ComponentState> {

  constructor(props) {
    super(props);

    this.state = {
      checked: !!this.props,
    }
  }

  toggleCheckbox = (e) => {
    
    const {input, updateTextArea, boxIndex} = this.props;
    const {addText: checked} = input;
    console.log('toggleCheckbox')
    console.log(checked, boxIndex)
    updateTextArea(boxIndex, !checked);
  }

  doNothing = () => {

  }

  render() {
    let {
      w,
      h,
      x,
      y,
      addText
    } = this.props.input;

    const {editable, scale} = this.props;
    x *= scale;
    y *= scale;
    w *= scale;
    h *= scale;

    const checkicon = {
      // color: backgroundColor, 
      className: "global-class-name", 
      size: "100%",
      padding: 0,
      margin: 0,
      // width: '100%',
      // height: '100%',
      style: {
        // position: 'absolute',
      }
    }

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
      border: 'solid 2px black',
    }

    return (
      <div
        style={editable ? editableStyle : nonEditableStyle}
        onClick={editable ? this.toggleCheckbox : this.doNothing}
      >
        {addText && 
        <IconContext.Provider value={checkicon}>
          <IoMdCheckmark />
        </IconContext.Provider>
        }
      </div>
    );
  }
}

export default PlainBoxForCheckbox;
