import 'raf/polyfill';
import 'es6-shim';
import 'es6-promise';
import 'reset-css/reset.css';
import "@babel/polyfill";
import * as React from 'react';
import ContractContainer from '../../src/containers/desktop/Contract';
import HTML5Backend from "react-dnd-html5-backend";
import {DragDropContextProvider} from "react-dnd";
import {getDocumentInfoForSigner} from "../../src/api/signer/getDocumentInfoForSinger";
import Head from 'next/head'

class Contract extends React.Component<any, React.ComponentState> {

  static async getInitialProps({ query }) {
    console.log('getInitialProps!')
    const { docNo, signerNo } = query;

    return {signerNo, documentNo: docNo}
  }

  constructor(props) {
    super(props);

    this.state = {
      signer: {},
      inputs: [],
      documentUrl: ''
    }
  }

  componentDidMount() {

    const urlParams = new URLSearchParams(window.location.search);
    const documentNo = urlParams.get('docNo');
    const signerNo = urlParams.get('signerNo');

    // const { signerNo, documentNo } = this.props;
    getDocumentInfoForSigner(documentNo, signerNo)
      .then((data: any) => {
        console.log('then data ==================================')
        console.log(data);
        this.setState({
          signer: data.signer,
          inputs: data.inputs,
          documentUrl: data.filePath,
          documentNo,
          signerNo
        });
      });
  }

  render() {
    // const { documentNo } = this.props;
    const { documentNo } = this.state;
    const { signer, inputs, documentUrl } = this.state;
console.log("inputs.length : " + inputs.length);
    if(inputs.length < 1) return null;

    return(
      <div>
        <Head>
          <title>kt - contract</title>
          {/* <link href="/assets/css/style.css" rel="stylesheet" /> */}
          <link href="/static/assets/css/style.css" rel="stylesheet" />
        </Head>
        <DragDropContextProvider backend={HTML5Backend}>
          <ContractContainer
            signer={signer}
            inputs={inputs}
            documentUrl={documentUrl}
            documentNo={documentNo}
          />
        </DragDropContextProvider>
      </div>
    );
  }
}

export default Contract;