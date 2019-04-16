import * as React from "react";
import { pdfjs } from 'react-pdf';
import MemoMarker from "../../../src/components/MemoMarker";
import { Input, MemoInput } from "src/interface/Input";
import { setCompleteInfo } from "../../api/complete/setCompleteInfo";
import apiPath from "../../api/enum/apiPath";
import { setDocumentInfoForSigner } from "../../api/signer/setDocumentInfoForSinger";
import DimmedLayer from "../../components/DimmedLayer";
import PlainBoxContainer from "../../components/PlainBoxContainer";
import SignatureLayer from "../../components/SignatureLayer";
import { ISigner } from "../../interface/ISigner";
import { deepCopy } from "../../util/deepCopy";
import PdfViewer from "./PdfViewer";
// import "./reset.css";
import $ from 'jquery';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const styled = require('./common.css');

// interface IInput {
//   inputType: string;
//   font: string;
//   charSize: string;
//   signerNo: string;
//   x: number;
//   y: number;
//   w: number;
//   h: number;
//   addText: string;
//   page: number;
//   boxIndex: number;
// }

interface IContractProps {
  documentUrl: string;
  documentNo: number;
  signer: ISigner;
  inputs: Array<Input>;
  completePage: boolean;
}

// const convertView = (view_w, view_h, left, top, width, height) => {
//   console.log('convertView')
//   console.log(view_w, view_h, left, top, width, height);

//   const x = Number(left) * view_w;
//   const w = Number(width) * Number(view_w);
//   const h = Number(height) * Number(view_h);
//   const y = (((Number(top) * view_h) - view_h) + Number(h)) * -1;

//   console.log(x, y, w, h)

//   return {
//     x,
//     y,
//     w,
//     h
//   }
// };

class ContractContainer extends React.Component<IContractProps, React.ComponentState> {

  constructor(props) {
    super(props);
    console.log('constructor!');
    this.state = {
      signer: [],
      inputs: [],
      numPages: null,
      pageNumber: 1,
      showSignLayer: false,
      scale: 1.5,
      newInputBox: null,
    };

    this.updateSignUrl = this.updateSignUrl.bind(this);
    this.updateTextArea = this.updateTextArea.bind(this);
    this.controlSignLayer = this.controlSignLayer.bind(this);
    // this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
    // this.getNewPdfItem = this.getNewPdfItem.bind(this);
    this.saveContractInfo = this.saveContractInfo.bind(this);
    this.saveCompleteInfo = this.saveCompleteInfo.bind(this);
    // this.updateRightContentZoom = this.updateRightContentZoom.bind(this);
  }

  componentDidMount() {
  
  }

  static getDerivedStateFromProps(nextProps, prevState) {

    if(prevState.inputs.length > 0) {
      return null;
    }

    console.log('prevState', prevState)
    console.log('nextProps', nextProps)

   const { signer, inputs } = nextProps;

   return {
     signer,
     inputs,
   };
  }

  componentDidUpdate(_, prevState) {
    
  }

  private updateTextArea(index, value) {
    const { inputs } = this.state;
    const newInputs = deepCopy(inputs);
    newInputs[index].addText = value;

    this.setState({ inputs: newInputs });
  }

  // private initBoxData() {
  //   console.log('initBoxData!')
  //   // const { view_w, view_h } = this.state;
  //   // const { pageWidth, pageHeight } = this.state;    
  //   const { signer, inputs } = this.props;
  //   const { zoom } = this.state;
  //   const restoreViewInfo = inputs.map(input => {
  //     return {
  //       ...input,
  //       x: input.x * zoom,
  //       y: input.y * zoom,
  //       w: input.w * zoom,
  //       h: input.h * zoom,
  //     }

  //     // const { x, y, w, h } = convertView(pageWidth, pageHeight, input.x, input.y, input.w, input.h);
  //     // return {
  //     //   ...input,
  //     //   x,
  //     //   y,
  //     //   w,
  //     //   h
  //     // }
  //   });
  //   // const restoreViewInfo = inputs;

  //   this.setState({
  //     signer,
  //     originInputs: inputs,
  //     // inputs
  //     inputs: restoreViewInfo
  //   });
  // }


  private controlSignLayer(index) {
    const {showSignLayer} = this.state;

    this.setState({
      showSignLayer: !showSignLayer,
      selectedIndex: showSignLayer ? -1 : index
    })
  }

  private updateSignUrl(signImgSrc) {
    const { selectedIndex, inputs } = this.state;
    const newInputs = deepCopy(inputs);

    newInputs[selectedIndex].signUrl = signImgSrc;

    this.setState({ inputs: newInputs });
  }

  private isValidInput(input) {
    let isNotEmpty;

    switch(input.inputType) {
      case 'text':
        
        isNotEmpty = this.state.signerNo != input.signerNo || !!input.addText ;
        if(!isNotEmpty) { alert('텍스트영역을 채워주세요.'); }
        return isNotEmpty;
      case 'sign':
        isNotEmpty = this.state.signerNo != input.signerNo || !!input.signUrl;
        if(!isNotEmpty) { alert('사인영역을 채워주세요.'); }
        return isNotEmpty;
    }
    return true;
  }

  private saveContractInfo(strHash) {
    console.log('saveContractInfo')
    // console.log(this.state.inputs)

    // 포탈에서 넘어온 해시값
    // const userhash = strHash;    
    const userHash = 'testhash1234';
    
    const { documentNo } = this.props;
    const { inputs, signer } = this.state;
    const signerNo = signer.signerNo;
    const isValidInputs = inputs.every(input => this.isValidInput(input));
    if(!isValidInputs) return false;

    const newInputs = inputs.map((input, index) => {
      if(input.inputType === 'checkbox') {
        return {
          ...input,
          addText: input.addText ? 'Y' : 'N',
        }
      }
      return input;
    });

    setDocumentInfoForSigner(documentNo, signerNo, {inputs: newInputs, userHash}).then((data:any) => {      
      if(data.code == '200'){
        alert('저장 완료');
      }else{
        alert('저장 처리중 에러 : ' + data.code);
      }
    });
  }

  private saveCompleteInfo() {
    console.log('saveCompleteInfo')
    const { documentNo } = this.props;
    const { inputs, originInputs, signer } = this.state;
    const signerNo = signer.signerNo;
    const domain = `${apiPath.DOMAIN.HOSTNAME}:${apiPath.DOMAIN.PORT}`;
    setCompleteInfo(documentNo, signerNo).then((data:any) => {
      if(data.code == '200'){
        alert('저장 완료');
      }else{
        alert('저장 처리중 에러 : ' + data.code);
      }
      
    });
  }

  // updateRightContentZoom(zoom) {
  //   const {zoom: prevScale} = this.state;
  //   const nextScale = zoom;
  //   const ratio = nextScale / prevScale;
  //   console.log(prevScale, nextScale, ratio)
  //   const newBoxDataList = this.scaleMarker(ratio);
  //   console.log(newBoxDataList)
  //   this.setState({
  //     zoom,
  //     inputs: newBoxDataList
  //   }, () => { console.log(this.state.inputs) });
  // }

  // private scaleMarker(scale) {
    
  //   const {inputs} = this.state;
  //   console.log('scaling start scale = ', scale)
  //   console.log(inputs);

  //   // console.log('scale = ', scale)
  //   // console.log(inputs)
  //   const newBoxDataList = inputs.map((data, boxIndex) => {
  //       return {
  //         ...data,
  //         x: data.x * scale,
  //         y: data.y * scale,
  //         w: data.w * scale,
  //         h: data.h * scale
  //       }
  //     }
  //   );
  //   console.log('scaling done')
  //   console.log(newBoxDataList)

  //   return newBoxDataList;
  // }


  getInitMemo = (page, signerNo): MemoInput => {
    return {
      inputType: 'memo',
      font: 'Times-Roman',
      charSize: '12',
      signerNo,
      x: 200,
      y: 200,
      w: 200,
      h: 150,
      addText: '',
      page,
      boxIndex: this.state.inputs.length,
    }
  }

  newMemo = (e) => {
    const { inputs, originInputs, signer, pageNumber } = this.state;
    const memo = this.getInitMemo(pageNumber, signer.signerNo);
    memo.x = e.pageX;
    memo.y = e.pageY;

    this.setState( {
      newMemo: memo
    })
  }

  deleteInputBox = (boxIndex: number): void => {
    
    const { inputs } = this.state;
    const newInputs = inputs.filter((box, index) => {
      return boxIndex !== index;
    });
    
    console.log(`deleted input box ${boxIndex}. newinputs = `, newInputs)

    this.setState({inputs: newInputs});
  }

  updateInputBox = (boxIndex: number, update: object) => {
    console.log('updateInputBox');
    console.log(update, boxIndex)
    const {inputs} = this.state;
    console.log(inputs)
    const newInputs = inputs.map((box, index) => {
      if(boxIndex === index) {
        return {
          ...box,
          ...update
        }
      }

      return box;
    });
    console.log(newInputs)

    this.setState({inputs: newInputs});
  }

  onPageChange = (pageNumber: number, scrollTo: number) => {
    this.setState({pageNumber}, () => {
      if(scrollTo >= 0) {
        window.scrollTo(0, scrollTo);
      }
    });
  }

  zoomIn = (e) => {
    this.setState({
      scale: this.state.scale * 1.1,
    }, () => console.log(this.state.scale))
  }
  zoomOut = (e) => {
    this.setState({
      scale: this.state.scale / 1.1,
    })
  }

  handleMouseMove = (e: React.MouseEvent) => {
    const {newMemo} = this.state;
    if(!newMemo) {
      return;
    }
    
    this.setState({
      newMemo: {
        ...newMemo,
        x: e.pageX,
        y: e.pageY
      }
    })
  }

  onInputboxAreaMouseUp = (e: React.MouseEvent) => {
    const {newMemo, scale, pageNumber} = this.state;
    if(!newMemo) {
      return;
    }
    console.log('drop the beat!!')
    let x = e.pageX - $(e.currentTarget).offset().left;
    let y = e.pageY - $(e.currentTarget).offset().top;
    let w = newMemo.w;
    let h = newMemo.h;
    
    x /= scale; 
    y /= scale; 
    w /= scale; 
    h /= scale;
    
    newMemo.x = x;
    newMemo.y = y;
    newMemo.w = w;
    newMemo.h = h;
    newMemo.page = pageNumber;
    
    this.addMemo(newMemo);
  }

  addMemo = (memo: MemoInput) => {
    const copy = [...this.state.inputs];
    copy.push(memo);
    this.setState({
      inputs: copy,
      newMemo: null,
    })
  }

  public render(): JSX.Element {
    const {
      pageNumber,
      numPages,
      showSignLayer,
      signer,
      inputs,
      selectedIndex,
      scale,
      newMemo
    } = this.state;

    console.log('inputs!!!!!!!!!!!!!!!!!!!!!!', inputs)

    return (
      <div className="container service">
        <div className='editor'
          onMouseMove={this.handleMouseMove}
        >
          {
            newMemo &&
            <div
                style={{
                    width: newMemo.w,
                    height: newMemo.h,
                    left: newMemo.x,
                    top: newMemo.y,
                    position: 'absolute',
                    zIndex: 100000,
                    pointerEvents: 'none',
                }}
            >
              <MemoMarker
                boxIndex={undefined}
                input={newMemo as MemoInput}
                updateTextArea={undefined}
                editable={false}
                updateInputBox={undefined}
                deleteInputBox={undefined}
              />
            </div>
          }

          <div className='header'>
            <ul className="zoom">
              <li><a onClick={(e) => this.zoomIn(e)}><span className="icon-zoomin"></span></a></li>
              <li><a onClick={(e) => this.zoomOut(e)}><span className="icon-zoomout"></span></a></li>
            </ul>
            {/* <ZoomController updateRightContentZoom={this.updateRightContentZoom} zoom={zoom}/> */}
          </div>
          <div className="edit-body">

            <PdfViewer documentUrl={this.props.documentUrl} scale={scale} onPageChange={this.onPageChange} pageNumber={pageNumber}>
                        <PlainBoxContainer
                          users={[signer]}
                          inputs={inputs}
                          updateTextArea={this.updateTextArea}
                          controlSignLayer={this.controlSignLayer}
                          pageNumber={pageNumber}
                          updateInputBox={this.updateInputBox}
                          deleteInputBox={this.deleteInputBox}
                          scale={scale}
                          onInputboxAreaMouseUp={this.onInputboxAreaMouseUp}
                        />
              </PdfViewer>

            {/* <div className="thumbnail">
              <ul>
                      <Document
                        file={this.props.documentUrl}
                      >
                        {Array.from(
                          new Array(numPages),
                          (el, index) => (
                            <li 
                              key={index}
                              className={pageNumber === index+1  ? 'on' : undefined}
                            >
                              <a href="#" data-index={index} onClick={this.getNewPdfItem}>
                                <Page
                                  key={`page_${index + 1}`}
                                  pageNumber={index + 1}
                                  renderMode='canvas'
                                  renderTextLayer={false}
                                  renderAnnotationLayer={false}
                                  onLoadSuccess={page => console.log(`thumbnail page-${page.pageNumber} loaded`)}
                                  onRenderSuccess={this.onThumbnailRenderSuccess}
                                  scale={0.22}
                                />
                              </a>
                            </li>
                          ),
                        )}
                      </Document>
              </ul>
            </div>
            <div className="editor-view">
              <Document
                className='document-wrapper'
                file={this.props.documentUrl}
                onLoadSuccess={this.onDocumentLoadSuccess}
              >
                <Page 
                  className='page-wrapper'
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  scale={zoom}
                  onLoadSuccess={this.onPageLoadSuccess}
                  onRenderSuccess={this.onPageRenderSuccess}
                >
                  <div
                    className="inputbox-area"
                    // style={{
                    //   width: this.state.pageWidth,
                    //   height: this.state.pageHeight,
                    //   position: 'absolute',
                    //   marginTop: '10px',
                    //   // paddingBottom: '10px',
                    //   zIndex: 10,
                    //   top: 0,
                    //   left: '50%',
                    //   transform: 'translateX(-50%)',
                    // }}
                    // onMouseMove={this.documentMouseMove}
                    // onMouseUp={this.updateEventObjectToNull}
                  >
                        <PlainBoxContainer
                          users={[signer]}
                          inputs={inputs}
                          updateTextArea={this.updateTextArea}
                          controlSignLayer={this.controlSignLayer}
                          pageNumber={pageNumber}
                          updateInputBox={this.updateInputBox}
                          deleteInputBox={this.deleteInputBox}
                        />
                  </div>
                </Page>
              </Document>
            </div> */}
            
            <div className="edit-pallet">
              <ul>
                <li><a onClick={this.newMemo}><span className="icon-memo"></span>메모 입력</a></li>
                <li><a onClick={this.props.completePage ? this.saveCompleteInfo : this.saveContractInfo}>저장</a></li>
              </ul>
            </div>
          
          
          

          <DimmedLayer showSignLayer={showSignLayer} >
            <SignatureLayer
              inputs={inputs}
              signerNo={signer.signerNo}
              controlSignLayer={this.controlSignLayer}
              selectedIndex={selectedIndex}
              updateSignUrl={this.updateSignUrl}
            />
          </DimmedLayer>

          </div>
        </div>
      </div>
    );
  }
}
export default ContractContainer;
