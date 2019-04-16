import $ from 'jquery';
import * as React from "react";
import { Document, Page, pdfjs } from 'react-pdf';




// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `pdf.worker.js`;





interface Props {
  documentUrl: string;
  scale: number;
  onPageChange: (pageNumber: number) => void;
  setScale: (scale: number) => void;
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

  scrollTo = -1;

  pageRendering = false;

  componentDidMount() {
    $('.editor-view').on('mousewheel', this.handleMouseWheel);
  }

  componentWillUnmount() {
    $('.editor-view').off('mousewheel', this.handleMouseWheel);
  }
  
  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.pageNumber !== prevState.pageNumber) {
      return {pageNumber: nextProps.pageNumber};
    }
    return null;
  }

  handleMouseWheel = e => {
    // console.log($(window).scrollTop(), $(window).height(), $(document).height())
    console.log($('.editor-view').scrollTop()
              , $('.editor-view').height()
              , $('.editor-view').scrollTop() + $('.editor-view').height()
              , $('.document-wrapper').height())
    // console.log(document.body.scrollHeight)
    if(this.pageRendering) {
      console.log('page still rendering!')
      return;
    }
    if( this.thumbnail.contains(e.target) ) {
      console.log('scroll on thumbnail!')
      return;
    }

    if(e.originalEvent.wheelDelta /120 > 0) {
        console.log('scrolling up !');
        
        // if($(window).scrollTop() == 0) {
        if($('.editor-view').scrollTop() == 0) {
          console.log('Document.tsx top boom!')
          let {pageNumber, numPages} = this.state;
          pageNumber--;
          if(pageNumber >= 1) {
            console.log('setting page ', pageNumber)
            e.preventDefault()
            this.pageRendering = true;
            // this.scrollTo = document.body.scrollHeight;
            this.scrollTo = $('.document-wrapper').height();
            this.props.onPageChange(pageNumber);
            // window.scrollTo(0,document.body.scrollHeight);
          }
        }
    }
    else{
        console.log('scrolling down !');
        
        if($('.editor-view').scrollTop() + $('.editor-view').height() > $('.document-wrapper').height()) {
          console.log('Document.tsx bottom boom!')
          let {pageNumber, numPages} = this.state;
          pageNumber++;
          if(pageNumber <= numPages) {
            console.log('setting page ', pageNumber)
            e.preventDefault();
            this.pageRendering = true;
            this.scrollTo = 0;
            this.props.onPageChange(pageNumber);
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
    console.log('DocumentLoadSuccess', screen.width, pdf)
    this.setState({
      numPages: pdf.numPages
    });
  };

  onPageLoadSuccess = (page) => {
    console.log('Document.tsx PageLoadSuccess')
    if(this.props.scale === undefined) {
      const width = screen.width <= 1000 ? screen.width : $('.editor-view').width();
      const scale = width / page.originalWidth / 1.1;
      this.props.setScale(scale);
    }
    
    if(this.scrollTo !== -1) {
      document.querySelector('.editor-view').scrollTop = this.scrollTo;
      // window.scrollTo(0, this.scrollTo);
      this.scrollTo = -1;
    }
  }

  thumbnail = null;
  curThumbnail = null;

  onPageRenderSuccess = (page) => {
    // $('.editor-view canvas').css('width', '').css('height', '')
    console.log('Document.tsx PageRenderSuccess', page)
    this.pageRendering = false;
    
    if( !this.isElementInViewport(this.curThumbnail) ) {
      console.log('ElementNotInViewport!')

      if(screen.width > 1000) {
        let scrollTo = this.curThumbnail.offsetTop;
        let padding = Number($(this.thumbnail).css('padding-top').replace('px', '') - 1);
        scrollTo -= padding;
        // this.thumbnail.scrollTo(0, scrollTo)
        this.thumbnail.scrollTop = scrollTo;
      }
      else {
        let scrollTo = this.curThumbnail.offsetLeft;
        let padding = 10;
        scrollTo -= padding;
        this.thumbnail.scrollLeft = scrollTo;
      }
    }

    
  }


  onThumbnailRenderSuccess = () => {
    $('.thumbnail canvas').css('width', '').css('height', '').css('display', '');
  }

  

  isElementInViewport = (el) => {
    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
  }
  

  public render(): JSX.Element {

    const {
      pageNumber,
      numPages,
    } = this.state;

    const { scale } = this.props;
    console.log('scale = ', scale)


    return (
          <React.Fragment>
            <div className="thumbnail" ref={ref => this.thumbnail = ref}>
              
                      <Document
                        className='thumbnail-document-wrapper'
                        file={this.props.documentUrl}
                      >
                        <ul>
                        {Array.from(
                          new Array(numPages),
                          (el, index) => (
                            <li 
                              key={index}
                              className={pageNumber === index+1  ? 'on' : undefined}
                              ref={ref => {if(pageNumber === index+1) this.curThumbnail = ref} }
                            >
                              <a data-index={index} onClick={this.getNewPdfItem}>
                                <Page
                                  className='thumbnail-page-wrapper'
                                  key={`page_${index + 1}`}
                                  pageNumber={index + 1}
                                  renderMode='canvas'
                                  renderTextLayer={false}
                                  renderAnnotationLayer={false}
                                  // onLoadSuccess={page => console.log(`thumbnail page-${page.pageNumber} loaded`)}
                                  onRenderSuccess={this.onThumbnailRenderSuccess}
                                  // scale={0.22}
                                  width={130}
                                >
                                  <span className="thumbnail-label">{index + 1}</span>
                                </Page>
                              </a>
                            </li>
                          ),
                        )}
                        </ul>
                      </Document>
                  {/* <li><div><img src="/assets/images/sample.jpg" alt=""></img></div></li>
                  <li><div><img src="/assets/images/sample.jpg" alt=""></img></div></li>
                  <li><div><img src="/assets/images/sample.jpg" alt=""></img></div></li>
                  <li><div><img src="/assets/images/sample.jpg" alt=""></img></div></li>
                  <li><div><img src="/assets/images/sample.jpg" alt=""></img></div></li>
                  <li><div><img src="/assets/images/sample.jpg" alt=""></img></div></li>
                  <li><div><img src="/assets/images/sample.jpg" alt=""></img></div></li>
                  <li><div><img src="/assets/images/sample.jpg" alt=""></img></div></li> */}
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

