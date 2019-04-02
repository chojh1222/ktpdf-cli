import "@babel/polyfill";
import 'es6-promise';
import 'es6-shim';
import Head from 'next/head';
import 'raf/polyfill';
import * as React from 'react';
import 'reset-css/reset.css';
import DocumentContainer from '../../src/containers/desktop/Document';
import { ISigner } from "../../src/interface/ISigner";

interface IDocumentProps {
  documentNo: string;
  documentUrl: string;
  signerList: Array<ISigner>;
  
  tmpDocId: string;
  regId: string;
  inputs:[];
}

// interface IDocumentInfoAPIResponse {
//   doc: string;

//   docId: string;
//   docName: string;
//   fileName: string;
//   filePath: string;
//   userId: string; 
//   signers: Array<ISigner>;  
//   inputs:[];
// }

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

class Document extends React.Component<IDocumentProps, React.ComponentState> {

  // static async getInitialProps({query}) {
    // console.log('query = ', query)
    // return {test: param};
    
    // 포탈에서 호출 시 시작
    // 아이디(템플릿아이디) 를 받아 조회하는 방식으로 변경될 예정
    // console.log("query 1 :: " + JSON.stringify(query));

    // //let docInfo = JSON.stringify(query);
    
    // console.log('query = ', query)
    // let docInfo = JSON.parse(JSON.stringify(query));
    // let params = JSON.parse(docInfo.params);

    // let signers = params.signers;
    
    // let documentNo = params.docId;    
    // let documentUrl = params.docPath;
    // let signerList = signers;
    // let tmpDocId = params.tmpDocId;
    // let regId = params.regId;

    // return {documentNo, documentUrl, signerList, tmpDocId, regId};
    
    // 포탈에서 호출 시 끝

    // let documentNo = query.docNo;
    // let {tmpDocId, regId } = query;
    // return {documentNo, tmpDocId, regId};
  // }

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
    // console.log("componentDidMount>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    // const documentNo = this.props.documentNo;

    const urlParams = new URLSearchParams(window.location.search);
    const docNo = urlParams.get('docNo');
    console.log('docNo = ', docNo); 

    // docNo 로 db 조회

    // 임시
    this.setState({
      documentNo: docNo,
      documentUrl: 'http://localhost:8888/escDoc/pdf/sample.pdf',
      signerList: [
        { "signerId": "signer1", "signerNm": "생성자", "signerNo": 1 }, 
        { "signerId": "signer2", "signerNm": "유저2", "signerNo": 2 }, 
        { "signerId": "signer3", "signerNm": "유저3", "signerNo": 3 }
      ],
      regId: 'signer1',
      tmpDocId: '',
    })
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

    // 템플릿 아이디가 있다면 기존 객체를 조회해본다.
    // getDocumentInfo(documentNo)
    // getDocumentInfo(documentNo, tmpDocId, regId)
    //   .then((data: IDocumentInfoAPIResponse) => {
    //     // this.setState({
    //     //   // documentUrl: data.doc,
    //     //   // documentNo: data.docId // 문서아이디  
    //     //   // ,docName: data.docName
    //     //   // ,fileName: data.fileName   
    //     //   // ,documentUrl: data.filePath // 문서경로
    //     //   // ,userId: data.userId
    //     //   // ,signerList: data.signers
    //     //   inputs: data.inputs
    //     // })
    //   });      
  }


  render() {
    // const {documentNo} = this.props;
    // const {documentUrl, signerList} = this.state;
    // const {tmpDocId, regId} = this.props;
    const {documentNo} = this.state;
    const {documentUrl, signerList} = this.state;
    const {tmpDocId, regId} = this.state;
    
    const {docName, fileName} = this.state;

    // console.log("regId : " + regId);
    const {inputs} = this.state;
    console.log("====== index.tsx ->  render ");  

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
          {/* <link href="/assets/css/style.css" rel="stylesheet" /> */}
          <link href="/static/assets/css/style.css" rel="stylesheet" />
        </Head>
        <DocumentContainer
          documentUrl={documentUrl}
          signerList={users}
          documentNo={documentNo}
          docName={docName}
          fileName={fileName}
          userId={regId}
          inputs={inputs}
          tmpDocId={tmpDocId}
        />
      </div>
    );
  }

}

export default Document;