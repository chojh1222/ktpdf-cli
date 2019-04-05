import React, { Component } from 'react';
import { Rnd } from 'react-rnd';
import { RadioBox } from 'src/interface/InputBox';
import { ISigner } from 'src/interface/ISigner';
import RadioMarker from './RadioMarker';


interface Props {
  boxData: RadioBox;
  users: Array<ISigner>;
  updateInputBox: (boxIndex: number, update: object) => void;
  deleteInputBox: (index: number) => void;
  scale: number;
}

class BoxWithRadio extends Component<Props, any> {

  constructor(props) {
    super(props);
  }

  radioMarker = null;



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
      minHeight,
      minWidth,
      maxHeight,
      maxWidth,
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



    console.log(this.radioMarker && this.radioMarker.state.mode)

    return (
        <Rnd
          size={{ width: width,  height: height }}
          position={{ x: left, y: top }}
          onDragStop={(e, d) => { updateInputBox(boxIndex, {left: d.x / scale, top: d.y / scale}) }}
          // onResizeStop={(e, direction, ref, delta, position) => {
          //     const w = (width + delta.width) / scale;
          //     const h = (height + delta.height) / scale;

          //     updateInputBox(boxIndex, {
          //       width: w,
          //       height: h,
          //         // ...position,
          //     });

          //     if(w > h) {
          //       this.setState({mode: 'horizontal'})
          //     } else {
          //       this.setState({mode: 'vertical'})
          //     }
          // }}
          onResize={(e, direction, ref, delta, position) => {
            let width = Number(ref.style.width.replace('px', '')) / scale;
            let height = Number(ref.style.height.replace('px', '')) / scale;
            
            updateInputBox(boxIndex, {
              width, 
              height
            });

            // if(this.state.mode === 'horizontal' && width < 2 * height) {
            //   this.setState({mode: 'vertical'})
            // }
            // else if(this.state.mode === 'vertical' && height < 2 * width) {
            //   this.setState({mode: 'horizontal'})
            // }

            // if(width > height) {
            //   this.setState({mode: 'horizontal'})
            // } else {
            //   this.setState({mode: 'vertical'})
            // }
          }}
          enableResizing={{ top:false, right:false, bottom:false, left:false, topRight:false, bottomRight:true, bottomLeft:false, topLeft:false }}
          enableUserSelectHack={true}
          bounds='parent'
          lockAspectRatio={false}
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
          // minWidth={this.radioMarker && this.radioMarker.state.mode === 'horizontal' ? height * 1 : undefined}
          // minHeight={this.radioMarker && this.radioMarker.state.mode === 'vertical' ? width * 1 : undefined}
          // minWidth={this.radioMarker && this.radioMarker.state.mode === 'vertical' ? 20 * scale : undefined}
          // minHeight={this.radioMarker && this.radioMarker.state.mode === 'horizontal' ? 20 * scale : undefined}
          // maxWidth={maxWidth ? maxWidth * scale : undefined}
          // maxHeight={maxHeight ? maxHeight * scale : undefined}
          minWidth={this.radioMarker && this.radioMarker.state.mode === 'vertical' ? minWidth * scale : undefined}
          minHeight={this.radioMarker && this.radioMarker.state.mode === 'horizontal' ? minWidth * scale : undefined}
        >
          
          <RadioMarker
            boxData={this.props.boxData}
            users={this.props.users}
            updateInputBox={this.props.updateInputBox}
            deleteInputBox={this.props.deleteInputBox}
            className={`radioMarker-${boxIndex}`}
            ref={ref => this.radioMarker = ref}
            width={width}
            height={height}
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
            //   overflow: 'hidden',
              backgroundColor: 'white',
              opacity: 0.7,
              position: 'absolute',
              textAlign: 'left',
            }}
            className='inputbox-body'
            data-number={boxIndex}
            data-type={type}
            data-page={page}
            onMouseOver={this.onMouseOver}
          >
            <IconContext.Provider value={this.state.mode === 'horizontal' ? radioiconLeft : radioiconTop}>
              <IoMdRadioButtonOn />
            </IconContext.Provider>

            <IconContext.Provider value={this.state.mode === 'horizontal' ? radioiconRight : radioiconBottom}>
              <IoMdRadioButtonOn />
            </IconContext.Provider>
          </div> */}

          
        </Rnd>
    );
  }
}

export default BoxWithRadio;