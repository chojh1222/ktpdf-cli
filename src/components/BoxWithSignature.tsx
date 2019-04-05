import React, { Component } from 'react';
import { Rnd } from 'react-rnd';
import { SignBox } from 'src/interface/InputBox';
import { ISigner } from 'src/interface/ISigner';
import SignatureMarker from './SignatureMarker';

interface Props {
  boxData: SignBox;
  users: Array<ISigner>;
  updateInputBox: (boxIndex: number, update: object) => void;
  deleteInputBox: (index: number) => void;
  scale: number;
}

class BoxWithSignature extends Component<Props, any> {

  constructor(props: Props) {
    super(props);

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
      minWidth,
    } = this.props.boxData;

    const {
      users,
      deleteInputBox,
      updateInputBox,
      scale,
    } = this.props;

    top *= scale;
    left *= scale;
    width *= scale;
    height *= scale;

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
        enableResizing={{ top:false, right:false, bottom:false, left:false, topRight:false, bottomRight:true, bottomLeft:false, topLeft:false }}
        enableUserSelectHack={true}
        bounds='parent'
        lockAspectRatio={true}
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
        minWidth={minWidth * scale}
        minHeight={minWidth * scale}
      >
        
        <SignatureMarker
          boxData={this.props.boxData}
          users={this.props.users}
          updateInputBox={this.props.updateInputBox}
          deleteInputBox={this.props.deleteInputBox}
          className={`signatureMarker-${boxIndex}`}
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
          style={{
            width: '100%',
            height: '100%',
            border: `1px solid ${backgroundColor}`,
            overflow: 'hidden',
            backgroundColor: 'white',
            opacity: 0.7,
            textAlign: 'center',
            verticalAlign: 'middle'
          }}
          className='inputbox-body'
          data-number={boxIndex}
          data-type={type}
          data-page={page}
          onMouseOver={this.onMouseOver}
        >
          <IconContext.Provider value={stampicon}>
            <FaStamp />
          </IconContext.Provider>
        </div> */}

        
      </Rnd>
    );
  }
}

export default BoxWithSignature;