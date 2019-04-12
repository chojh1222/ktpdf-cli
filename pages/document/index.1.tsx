import 'raf/polyfill';
import 'es6-shim';
import 'es6-promise';
// import 'reset-css/reset.css';
import "@babel/polyfill";
import * as React from 'react';
import DocumentContainer from '../../src/containers/desktop/Document';
import {getDocumentInfo} from "../../src/api/document/getDocumentInfo";
import {ISigner} from "../../src/interface/ISigner";
import {getDocumentInfoForSigner} from "../../src/api/signer/getDocumentInfoForSinger";

interface IDocumentProps {
  documentNo: string;
  documentUrl: string;
  signerList: Array<ISigner>;
  tmpDocId: string; // 템플릿문서아이디
  inputs:[];
  signerNo: string; //사용자 아이디
}

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

interface IDocumentInfoAPIResponse {
  doc: string;

  docId: string;
  docName: string;
  fileName: string;
  filePath: string;
  userId: string; 
  signers: Array<ISigner>;
  tmpDocId: string;
  inputs: Array<IInput>;
}

const backgroundColorList = [
  'red',
  'green',
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

  static async getInitialProps({query}) {
    console.log("================== getInitialProps ================================ ");

    // 파라메터로 임시아이디, 생성자아이디 받는다.
    let documentNo = query.docNo;
    let {tmpDocId, signerNo } = query;

    return {documentNo, tmpDocId, signerNo};
  }

  constructor(props) {
    super(props);

    this.state = {
      documentNo: 0,
      signerList: [],
      documentUrl: '',
      inputs:[]
    }
  }

  componentDidMount() {
    console.log("componentDidMount");
    const documentNo = this.props.documentNo;
    const tmpDocId = this.props.tmpDocId;
    const signerNo = this.props.signerNo;
    
    getDocumentInfo(documentNo)
      .then((data: IDocumentInfoAPIResponse) => {
        this.setState({
          // documentUrl: data.doc,
          // documentNo: data.docId, // 문서아이디  
          docName: data.docName,
          fileName: data.fileName,      
          documentUrl: data.filePath, // 문서경로 url 형식
          userId: data.userId, 
          signerList: data.signers
        })
      });

      if(tmpDocId != undefined){
        getDocumentInfoForSigner(tmpDocId, signerNo)
        .then((data: any) => {
          this.setState({
            // signer: data.signer,
            // documentUrl: data.filePath,
            inputs: data.inputs
          });
        });
      }    
  }

  render() {
    
    const {documentNo} = this.props;
    const {documentUrl, signerList, docName, fileName, userId} = this.state;    
    const {inputs} = this.state;    
    console.log("inputs : " + inputs.length);
    const users = signerList ? signerList.map((user, index) => ({
      ...user,
      backgroundColor: backgroundColorList[index] ? backgroundColorList[index] : defaultBackgroundColor,
      color: backgroundColorList.indexOf(String(index)) > -1 ? '#fff' : '#000'
    })) : [];

    if(users.length < 1) return null;

    return (
      <div>
        <DocumentContainer
          documentUrl={documentUrl}
          signerList={users}
          documentNo={documentNo}
          docName={docName}
          fileName={fileName}
          userId={userId}
        />
      </div>
    );
  }

}

export default Document;