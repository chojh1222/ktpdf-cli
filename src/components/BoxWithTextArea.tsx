import React, { Component } from 'react';
import { Rnd } from 'react-rnd';
import { TextBox } from 'src/interface/InputBox';
import { ISigner } from 'src/interface/ISigner';
import Popup from "./Popup";
import PopupForTextarea from "./PopupForTextarea";
import TextMarker from './TextMarker';

const defaultZIndex = 20;
const oo = 987654321;

interface Props {
  boxData: TextBox;
  users: Array<ISigner>;
  updateInputBox: (boxIndex: number, update: object) => void;
  deleteInputBox: (index: number) => void;
  scale: number;
}

class BoxWithTextArea extends Component<Props, any> {

  constructor(props) {
    super(props);

    this.state = {
      isShowPopup: false,
      zIndex: defaultZIndex,
      showCloseBtn: false,
    };
  }



  togglePopup = () => {
    this.setState({
      isShowPopup: !this.state.isShowPopup
    })
  }



  render() {
    let {
      top,
      left,
      width,
      height,
      page,
      type,
      boxIndex,
      signerIndex,
      fontFamily,
      fontSize,
      minWidth
    } = this.props.boxData;


    


    const {
      users,
      deleteInputBox,
      updateInputBox,
      scale
    } = this.props;

    top *= scale;
    left *= scale;
    width *= scale;
    height *= scale;

    const { isShowPopup } = this.state;
    const { backgroundColor } = users[signerIndex];

    return (
        <Rnd
          size={{ width: width,  height: height }}
          position={{ x: left, y: top }}
          onDragStop={(e, d) => { updateInputBox(boxIndex, {left: d.x / scale, top: d.y / scale}) }}
          onResizeStop={(e, direction, ref, delta, position) => {
              updateInputBox(boxIndex, {
                  width: (width + delta.width) / scale,
                  height: (height + delta.height) / scale,
                  // ...position,
              });
          }}
          // onResize={(e, direction, ref, delta, position) => {
          //   let width = Number(ref.style.width.replace('px', '')) / scale;
          //   let height = Number(ref.style.height.replace('px', '')) / scale;
            
          //   updateInputBox(boxIndex, {
          //     width, 
          //     height
          //   });
          // }}
          enableResizing={{ top:false, right:false, bottom:false, left:false, topRight:false, bottomRight:true, bottomLeft:false, topLeft:false }}
          enableUserSelectHack={false}
          bounds='parent'
          dragHandleClassName={`textMarker-${boxIndex}`}
          resizeHandleStyles={{
            bottomRight: {
              position: 'absolute',
              width: '10px',
              height: '10px',
              background: `${backgroundColor}`,
              borderRadius: '10px 0 0 0',
              right: 0,
              bottom: 0,
              cursor: 'se-resize',
            }
          }}
          // style={{zIndex: 10000}}
          minHeight={fontSize * scale * 1.2}
          minWidth={minWidth * scale}
          // resizeGrid={[1, fontSize * scale * 1.2]}
        >
          <Popup
            isShowPopup={isShowPopup}
          >
            <PopupForTextarea
              updateInputBox={updateInputBox}
              boxIndex={boxIndex}
              fontFamily={fontFamily}
              fontSize={fontSize}
            />
          </Popup>

          <TextMarker 
            boxData={this.props.boxData}
            users={this.props.users}
            updateInputBox={this.props.updateInputBox}
            deleteInputBox={this.props.deleteInputBox}
            className={`textMarker-${boxIndex}`}
            onDoubleClick={this.togglePopup}
            scale={scale}
          />

          {/* <div
            className='inputbox-header' 
            style={{
              width: '100%',
              height: '18px',
              position: 'absolute',
              top: '-17px',
              border: `1px solid ${backgroundColor}`,
              backgroundColor: `${backgroundColor}`,
              color: 'white',
              borderRadius: '10px 10px 0 0',
              textAlign: 'right',
              display: 'none',
            }}
          >
            <span
              onClick={this.onCloseBtnClick}  
            >
              <IconContext.Provider value={closeicon}>
                <IoMdCloseCircle  />
              </IconContext.Provider>
            </span>
          </div>

          <div
            className={`textbox-${boxIndex}`}
            style={{width: '100%', height: '100%'}}
            onMouseOver={this.onMouseOver}
            // onMouseLeave={this.onMouseLeave}
          >
            <textarea
              // disabled={false}
              data-number={boxIndex}
              data-type={type}
              data-page={page}
            
              style={{
                width: '100%',
                height: '100%',
                fontFamily: fontFamily,
                fontSize: fontSize,
                resize: 'none',
                boxSizing: 'border-box',
                backgroundColor: '#fff',
                opacity: 0.7,
                border: `1px solid ${backgroundColor}`,
              }}
              placeholder="텍스트 입력란"
              onDoubleClick={this.togglePopup}
              
            />
            
          </div> */}
        </Rnd>
    );
  }
}

export default BoxWithTextArea;