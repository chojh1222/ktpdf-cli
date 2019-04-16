import 'raf/polyfill';
import 'es6-shim';
import 'es6-promise';
// import 'reset-css/reset.css';
import "@babel/polyfill";
import * as React from 'react';
import ContractContainer from '../../src/containers/desktop/Contract';
import HTML5Backend from "react-dnd-html5-backend";
import {DragDropContextProvider} from "react-dnd";
import {getDocumentInfoForSigner} from "../../src/api/signer/getDocumentInfoForSinger";
import Head from 'next/head'

class Contract extends React.Component<any, React.ComponentState> {

  static async getInitialProps({ query }) {
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
    const { signerNo, documentNo } = this.props;
    console.log('then data ==================================');
    console.log(signerNo);
    getDocumentInfoForSigner(documentNo, signerNo)
      .then((data: any) => {
        
        console.log(data);
        this.setState({
          signer: data.signer,
          inputs: data.inputs,
          documentUrl: data.filePath
        });
      });
  }

  render() {
    const { documentNo } = this.props;
    const { signer, inputs, documentUrl } = this.state;

    if(inputs != undefined){
      if(inputs.length < 1) return null;
    }

    return(
      <div>
        <Head>
          <title>kt - contract</title>
          <link href="/assets/css/style.css" rel="stylesheet" />
          <link href="/assets/css/viewer.css" rel="stylesheet" />
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