import * as React from "react";
import { TextInput } from "src/interface/Input";

interface IBoxForTextAreaProps {
  input: TextInput;
  boxIndex: number;
  updateTextArea: (...args) => void;
  editable: boolean
  scale: number;
}

class PlainBoxForTextArea extends React.Component<IBoxForTextAreaProps, React.ComponentState> {

  constructor(props) {
    super(props);

    this.state = {
      text: ''
    };

    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(e) {
    const { updateTextArea, boxIndex } = this.props;
    const val = e.target.value;
    updateTextArea(boxIndex, val);
  }

  render() {
    
    let {
      addText,
      x,
      y,
      w,
      h,
      font,
      charSize,
    } = this.props.input;

    const {editable, scale} = this.props;
    x *= scale;
    y *= scale;
    w *= scale;
    h *= scale;

    const editableStyle = {
      width: '100%',
      height: '100%',
      resize: 'none',
      fontFamily: font,
      // fontSize: `${charSize}px`,
      fontSize: `${Number(charSize) * scale}px`,
      // boxSizing: 'border-box',
      backgroundColor: 'white',
      opacity: 0.7,
      border: 'dotted 1.5px orange',
      padding: 0,
      margin: 0,
      overflow: 'hidden',
    };

    const nonEditableStyle = {
      ...editableStyle,
      border: 'none',
      backgroundColor: 'rgba(0, 0, 0, 0.0)'
    };

    return (
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: w,
          height: h,
          padding: 0,
          margin: 0,
        }}
      >
        {/* <input type="text" */}
        <textarea
          disabled={editable ? false : true}
          style={editable ? editableStyle : nonEditableStyle}
          onChange={this.handleOnChange}
          defaultValue={addText}
        />
      </div>
    )
  }
}

export default PlainBoxForTextArea;
