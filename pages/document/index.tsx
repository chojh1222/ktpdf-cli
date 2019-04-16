import 'raf/polyfill';
import 'es6-shim';
import 'es6-promise';
// import 'reset-css/reset.css';
import "@babel/polyfill";
import * as React from 'react';
import DocumentContainer from '../../src/containers/desktop/Document';
import {getDocumentInfo} from "../../src/api/document/getDocumentInfo";
import {getDocumentInfoForSigner} from "../../src/api/signer/getDocumentInfoForSinger";
import {ISigner} from "../../src/interface/ISigner";
import Head from 'next/head';
import { pdfjs } from 'react-pdf';

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface IDocumentProps {
  documentNo: string;
  documentUrl: string;
  signerList: Array<ISigner>;
  
  regId: string;
  inputs:[];
}

interface IDocumentInfoAPIResponse {
  doc: string;
  docId: string;
  docName: string;
  fileName: string;
  filePath: string;
  userId: string; 
  signers: Array<ISigner>;  
  inputs:[];
}

const backgroundColorList = [
  '#F15F5F', // 'red',
  '#6799FF', //'green',
  'blue',
  'yellow',
  'orange',
  'pink',
  'purple',
  'gray',
  'black',
  'skyblue',
  'blanchedalmond',
  'brown',
  'chocolate',
  'darkgray',
  'darkkhaki',
  'khaki',
  'darkturquoise',
  'deeppink',
  'cadetblue',
  'cyan'
];

const defaultBackgroundColor = '#fff';

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

class Document extends React.Component<IDocumentProps, React.ComponentState> {

  /*
  static async getInitialProps({query}) {

    // 포탈에서 호출 시 시작
    // 아이디(템플릿아이디) 를 받아 조회하는 방식으로 변경될 예정
    // console.log("query 1 :: " + JSON.stringify(query));

    // //let docInfo = JSON.stringify(query);
    
    console.log('query = ', query)
    let docInfo = JSON.parse(JSON.stringify(query));
    let params = JSON.parse(docInfo.params);

    let signers = params.signers;
    
    let documentNo = params.docId;    
    let documentUrl = params.docPath;
    let signerList = signers;
    let tmpDocId = params.tmpDocId;
    let regId = params.regId;

    return {documentNo, documentUrl, signerList, tmpDocId, regId};
    
    // 포탈에서 호출 시 끝

    // let documentNo = query.docNo;
    // let {tmpDocId, regId } = query;
    // return {documentNo, tmpDocId, regId};
  }
  */

  constructor(props) {    
    super(props);

    this.state = {
      documentNo: 0,
      signerList: [],
      documentUrl: '',
      inputs: []
    }
  }

  componentWillMount(){
    // console.log("componentWillMount");
  }

  componentDidMount() {

    // url 에서 파라메터 파싱
    // const urlParams = new URLSearchParams(window.location.search);
    // const documentNo = urlParams.get('docNo'); // 문서아이디
    // let tmpDocNo = urlParams.get('tmpDocNo'); // 템플릿 문서 아이디
    // const regId = urlParams.get('regId'); // 사용자아이디

    const documentNo = getParameterByName('docNo', null); // 문서아이디
    let tmpDocNo = getParameterByName('tmpDocNo', null); // 템플릿 문서 아이디
    const regId = getParameterByName('regId', null); // 사용자아이디

    if(tmpDocNo == null || tmpDocNo == ''){
      console.log('tmpDocNo is null !!!');
      tmpDocNo = "null";
    }
    console.log('documentNo = ', documentNo); 
    console.log('tmpDocNo = ', tmpDocNo); 

    // console.log("componentDidMount>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    // const documentNo = this.props.documentNo;    
    // const {tmpDocId, regId} = this.props;    

    // 템플릿 아이디가 있다면 기존 객체를 조회해본다.
    // if(tmpDocId == undefined || tmpDocId == ''){
    //   // console.log("tmpDocId 1 is undefined ");
    // }else{
    //   // console.log(" api 서버에서 조회를 시작한다.");
    //   getDocumentInfoForSigner(tmpDocId, regId)
    //   .then((data: any) => {           
    //     this.setState({
    //       // signer: data.signer,
    //       // documentUrl: data.filePath,          
    //       inputs: data.inputs
    //     });
    //   });
    // }

    // api 서버에서 각종 정보를 조회한다.  
    // getDocumentInfo(documentNo)
    getDocumentInfo(documentNo, tmpDocNo, regId)
      .then((data: IDocumentInfoAPIResponse) => {
        console.log(data);
        this.setState({          
          // documentUrl: data.doc,
          documentNo: data.docId // 문서아이디  
          // ,docName: data.docName
          // ,fileName: data.fileName   
          ,documentUrl: data.filePath // 문서경로
          // ,userId: data.userId
          ,signerList: data.signers
          ,inputs: data.inputs
        })
      });      
  }

  render() {
    console.log("render start");
    
    
    // const {documentNo} = this.props;
    // const {documentNo} = this.props;
    const {documentNo, documentUrl, signerList} = this.state;
    // const {documentUrl, signerList} = this.props;
    const {docName, fileName} = this.state;

    const {regId} = this.props;
    // console.log("regId : " + regId);
    const {inputs} = this.state;
    console.log(inputs);

    const users = signerList ? signerList.map((user, index) => ({
      ...user,
      backgroundColor: backgroundColorList[index] ? backgroundColorList[index] : defaultBackgroundColor,
      color: backgroundColorList.indexOf(String(index)) > -1 ? '#fff' : '#000'
    })) : [];

    if(users.length < 1) return null;

    return (
      <div>
        <Head>
          <title>kt - document</title>
          <link href="/assets/css/style.css" rel="stylesheet" />
          <link href="/assets/css/viewer.css" rel="stylesheet" />
        </Head>
        <DocumentContainer
          documentUrl={documentUrl}
          signerList={users}
          documentNo={documentNo}
          docName={docName}
          fileName={fileName}
          userId={regId}
          inputs={inputs}          
        />
      </div>
    );
  }

}

export default Document;