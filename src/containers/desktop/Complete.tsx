import * as React from "react";
import {Document, Page, pdfjs} from 'react-pdf';

// import "./reset.css";
import {deepCopy} from "../../util/deepCopy";
import DimmedLayer from "../../components/DimmedLayer";
import SignatureLayer from "../../components/SignatureLayer";
import {ISigner} from "../../interface/ISigner";
import PlainBoxContainer from "../../components/PlainBoxContainer";
import {setCompleteInfo} from "../../api/complete/setCompleteInfo";
import ZoomController from "../../components/ZoomController";
import $ from 'jquery';
import apiPath from "../../api/enum/apiPath";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const styled = require('./common.css');

interface IInput {
  inputType: string;
  font: string;
  charSize: string;
  signerNo: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface IContractProps {
  documentUrl: string;
  documentNo: number;
  signer: ISigner;
  inputs: Array<IInput>;
}

const convertView = (view_w, view_h, left, top, width, height) => {
  console.log('convertView')
  console.log(view_w, view_h, left, top, width, height);

  const x = Number(left) * view_w;
  const w = Number(width) * Number(view_w);
  const h = Number(height) * Number(view_h);
  const y = (((Number(top) * view_h) - view_h) + Number(h)) * -1;

  console.log(x, y, w, h)

  return {
    x,
    y,
    w,
    h
  }
};

class CompleteContainer extends React.Component<IContractProps, React.ComponentState> {

  constructor(props) {
    super(props);
    this.state = {
      signer: [],
      inputs: [],
      numPages: null,
      pageNumber: 1,
      showSignLayer: false,
      signature: null,
      selectedIndex: -1,
      zoom: 1,
      view_h: -1,
      view_w: -1,
      originInputs: []
    };

    this.updateSignUrl = this.updateSignUrl.bind(this);
    this.updateTextArea = this.updateTextArea.bind(this);
    this.controlSignLayer = this.controlSignLayer.bind(this);
    this.onDocumentLoadSuccess = this.onDocumentLoadSuccess.bind(this);
    this.getNewPdfItem = this.getNewPdfItem.bind(this);
    this.saveContractInfo = this.saveContractInfo.bind(this);
    this.updateRightContentZoom = this.updateRightContentZoom.bind(this);
  }

  async componentDidMount() {
    const $view = $('.doc-area');
    const view_w = $view.width();
    const view_h = $view.height();
    this.setState({
      view_w,
      view_h
    }, this.initBoxData);
  }

  componentDidUpdate(_, prevState) {
    const $view = $('.doc-area');
    const view_w = $view.width();
    const view_h = $view.height();

    if(view_h < 0 || prevState.view_h !== view_h){
      this.setState({
        view_w,
        view_h
      }, this.initBoxData);
    }
  }

  private updateTextArea(index, value) {
    const { inputs } = this.state;
    const newInputs = deepCopy(inputs);
    newInputs[index].addText = value;

    this.setState({ inputs: newInputs });
  }

  private initBoxData() {
    // const { view_w, view_h } = this.state;
    const { pageWidth, pageHeight } = this.state;
    const { signer, inputs } = this.props;

    // const restoreViewInfo = inputs.map(input => {
    //   const { x, y, w, h } = convertView(pageWidth, pageHeight, input.x, input.y, input.w, input.h);
    //   return {
    //     ...input,
    //     x,
    //     y,
    //     w,
    //     h
    //   }
    // });
    const restoreViewInfo = inputs;

    this.setState({
      signer,
      originInputs: inputs,
      inputs: restoreViewInfo
    });
  }

  private getNewPdfItem(e: React.MouseEvent) {
    e.preventDefault();
    const {pageNumber} = this.state;
    const idx = Number(e.currentTarget.getAttribute('data-index')) + 1;

    $('li.thumbnailList').find('canvas').css('opacity', 0.7);
    $(e.currentTarget).find('canvas').css('opacity', 1);
    
    this.setState({pageNumber: idx});
  }

  private onDocumentLoadSuccess({numPages}) {
    this.setState({numPages});
  };

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
  }

  private saveContractInfo() {
    const { documentNo } = this.props;
    const { inputs, originInputs, signer } = this.state;
    const signerNo = signer.signerNo;
    const domain = `${apiPath.DOMAIN.HOSTNAME}:${apiPath.DOMAIN.PORT}`;
    // const isValidInputs = inputs.every(input => this.isValidInput(input));
    // if(!isValidInputs) return false;

    // const newInputs = inputs.map((input, index) => {
    //   const { x, y, w, h } = originInputs[index];

    //   if(input.inputType === 'sign') {
    //     const newSignUrl = input.signUrl && input.signUrl.replace(domain, '');
    //     return {
    //       ...input,
    //       signUrl: newSignUrl,
    //       x,
    //       y,
    //       w,
    //       h
    //     }
    //   }

    //   return {
    //     ...input,
    //     x,
    //     y,
    //     w,
    //     h
    //   }
    // });

    // setCompleteInfo(documentNo, signerNo, {inputs: newInputs}).then(_ => {
      setCompleteInfo(documentNo, signerNo).then((data:any) => {
        if(data.code == '200'){
          alert('저장 완료');
        }else{
          alert('저장 처리중 에러 : ' + data.code);
        }
        
    });
  }

  convertToPDF = () => {

  }

  updateRightContentZoom(zoom) {
    const {zoom: prevScale} = this.state;
    const nextScale = zoom;
    const ratio = nextScale / prevScale;
    console.log(prevScale, nextScale, ratio)
    const newBoxDataList = this.scaleMarker(ratio);
    this.setState({
      zoom,
      inputs: newBoxDataList
    });
  }

  private scaleMarker(scale) {
    const {inputs} = this.state;
    const copyBoxDataList = deepCopy(inputs);
    console.log('scale = ', scale)
    console.log(inputs)
    const newBoxDataList = copyBoxDataList.map((data, boxIndex) => {
        return {
          ...data,
          x: data.x * scale,
          y: data.y * scale,
          w: data.w * scale,
          h: data.h * scale
        }
      }
    );
    console.log(newBoxDataList)

    return newBoxDataList;
  }

  onThumbnailRenderSuccess = (page) => {
    if(page.pageNumber == 1) {
      $('li.thumbnailList').find('canvas').first().css('opacity', 1.0);
    }
  }

  onPageLoadSuccess = (page) => {
    console.log('PageLoadSuccess')
  }

  onPageRenderSuccess = (page) => {
    console.log('PageRenderSuccess')
    console.log(page.width, page.height)
    this.setState({
      pageWidth: page.width,
      pageHeight: page.height
    })
    $('.viewerContainer').find('canvas').css('opacity', 1.0);
  }

  public render(): JSX.Element {
    const {
      pageNumber,
      numPages,
      showSignLayer,
      signer,
      inputs,
      selectedIndex,
      zoom
    } = this.state;

    const pdfItem = [];
    for (let i = 1; i <= numPages; i++) {
      pdfItem.push(i);
    }

    return (
      <div>
        <div className={styled.rightSidebar}>
          <div>
            <div style={{fontSize: '15px'}}>{`${pageNumber} / ${numPages}`}</div>
            <ZoomController updateRightContentZoom={this.updateRightContentZoom} zoom={zoom}/>
            <div style={{
              fontSize: '15px',
            }}>{signer.signerNm}</div>
          </div>
          <div style={{padding: '600px 0'}}>
            <button style={{
              width: '140px',
              height: '50px',
              marginLeft: '15%',
              position: 'relative',
              zIndex: 30
            }} onClick={this.saveContractInfo}
            >저장
            </button>
          </div>
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
        <div className={styled.wrapper}>
          {/* <ul className={styled.leftContents}>
            {pdfItem.length > 0 && pdfItem.map((item, index) =>
              <li key={index}>
                <a href="#" data-index={index} onClick={this.getNewPdfItem}>
                  <Document
                    className={styled.listCanvas}
                    file={this.props.documentUrl}
                  >
                    <Page pageNumber={item}/>
                  </Document>
                </a>
              </li>
            )}
          </ul> */}

          <ul className={styled.leftContents}>
            <Document
              className={styled.listCanvas}
              file={this.props.documentUrl}
            >
              {Array.from(
                new Array(numPages),
                (el, index) => (
                  <li key={index} style={{padding: '2px'}} className='thumbnailList'>
                    <a href="#" data-index={index} onClick={this.getNewPdfItem}>
                      <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        renderMode='canvas'
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        onLoadSuccess={page => console.log(`thumbnail page-${page.pageNumber} loaded`)}
                        onRenderSuccess={this.onThumbnailRenderSuccess}
                        scale={0.25}
                      />
                    </a>
                  </li>
                ),
              )}
            </Document>
          </ul>
          <div
            // style={{ zoom }}
            className={styled.rightContents}
          >
            <div
              className="doc-area"
              style={{
                width: this.state.pageWidth,
                height: '100%',
                position: 'absolute',
                zIndex: 10,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <PlainBoxContainer
                users={[signer]}
                inputs={inputs}
                updateTextArea={this.updateTextArea}
                controlSignLayer={this.controlSignLayer}
                pageNumber={pageNumber}
              />
            </div>
            <Document
              className='viewerContainer'
              file={this.props.documentUrl}
              onLoadSuccess={this.onDocumentLoadSuccess}
            >
              <Page 
                className={styled.page}
                pageNumber={pageNumber}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                scale={zoom}
                onLoadSuccess={this.onPageLoadSuccess}
                onRenderSuccess={this.onPageRenderSuccess}
              />
            </Document>
          </div>
        </div>
      </div>
    );
  }
}
export default CompleteContainer;
