import $ from 'jquery';
import * as React from "react";
import { Document, Page, pdfjs } from 'react-pdf';




// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;





interface Props {
  documentUrl: string;
  scale: number;
  onPageChange: (pageNumber: number, scrollTo: number) => void;
  pageNumber: number;
}

export default class PdfViewer extends React.Component<Props, React.ComponentState> {

  constructor(props) {
    super(props);
    this.state = {
      numPages: null,
      pageNumber: 1,
    };

    this.getNewPdfItem = this.getNewPdfItem.bind(this);
  }

  pageRendering = false;

  componentDidMount() {
    $(window).on('mousewheel', this.handleMouseWheel);
  }

  componentWillUnmount() {
    $(window).off('mousewheel', this.handleMouseWheel);
  }
  
  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.pageNumber !== prevState.pageNumber) {
      return {pageNumber: nextProps.pageNumber};
    }
    return null;
  }

  handleMouseWheel = e => {
    console.log($(window).scrollTop(), $(window).height(), $(document).height())
    if(this.pageRendering) {
      console.log('page still rendering!')
      return;
    }

    if(e.originalEvent.wheelDelta /120 > 0) {
        // console.log('scrolling up !');
        
        if($(window).scrollTop() == 0) {
          console.log('Document.tsx top boom!')
          let {pageNumber, numPages} = this.state;
          pageNumber--;
          if(pageNumber >= 1) {
            console.log('setting page ', pageNumber)
            e.preventDefault()
            this.pageRendering = true;
            this.props.onPageChange(pageNumber, document.body.scrollHeight);
            // window.scrollTo(0,document.body.scrollHeight);
          }
        }
    }
    else{
        // console.log('scrolling down !');
        
        if($(window).scrollTop() + $(window).height() >= $(document).height() - 1) {
          console.log('Document.tsx bottom boom!')
          let {pageNumber, numPages} = this.state;
          pageNumber++;
          if(pageNumber <= numPages) {
            console.log('setting page ', pageNumber)
            e.preventDefault();
            this.pageRendering = true;
            this.props.onPageChange(pageNumber, 0);
            // window.scrollTo(0, 0)
          }
        }
    }
  };


  componentDidUpdate(_, prevState): void {
  
  }

  private getNewPdfItem(e: React.MouseEvent) {
    e.preventDefault();
    const pageNumber = Number(e.currentTarget.getAttribute('data-index')) + 1;
    this.pageRendering = true;
    this.props.onPageChange(pageNumber, undefined);
  }


  onDocumentLoadSuccess = (pdf) => {
    this.setState({
      numPages: pdf.numPages
    });
  };

  onPageLoadSuccess = (page) => {
    // console.log('Document.tsx PageLoadSuccess')
  }

  onPageRenderSuccess = (page) => {
    console.log('Document.tsx PageRenderSuccess')
    this.pageRendering = false;
    // console.log(page.width, page.height)
    this.setState({
      pageWidth: page.width,
      pageHeight: page.height
    })
  }


  onThumbnailRenderSuccess = (page) => {
  
  }


  

  public render(): JSX.Element {

    const {
      pageNumber,
      numPages,
    } = this.state;

    const { scale } = this.props;


    return (
          <React.Fragment>
            <div className="thumbnail">

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
                              <a data-index={index} onClick={this.getNewPdfItem}>
                                <Page
                                  key={`page_${index + 1}`}
                                  pageNumber={index + 1}
                                  renderMode='canvas'
                                  renderTextLayer={false}
                                  renderAnnotationLayer={false}
                                  // onLoadSuccess={page => console.log(`thumbnail page-${page.pageNumber} loaded`)}
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
                  scale={scale}
                  onLoadSuccess={this.onPageLoadSuccess}
                  onRenderSuccess={this.onPageRenderSuccess}
                >
                  {this.props.children}
                </Page>
              </Document>

            </div>
          </React.Fragment>
    );
  }
}

