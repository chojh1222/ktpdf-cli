import * as React from "react";
class Index extends React.Component<{}, React.ComponentState> {

  public render(): JSX.Element {
    console.log('rendering index.tsx!')
    
    // const url = 'http://paperless.kt.com';
    const url = 'http://localhost';
    const port_node = '3000';
    // const port_api = '8080';
    const port_api = '8888';
    return (
      <div>
        <p><a href={'/document?docNo=190001'}>생성자 페이지</a></p>
        <p><a href={`${url}:${port_node}/document?params={"docId":"190001","regId":"signer1","tmpDocId":"","docPath":"${url}:${port_api}/escDoc/pdf/sample.pdf","docName":"테스트.pdf","signers":[{"signerId":"signer1","signerNm":"생성자","signerNo":1},{"signerId":"signer2","signerNm":"유저2","signerNo":2},{"signerId":"signer3","signerNm":"유저3","signerNo":3}]}`}>포탈 호출 생성자 페이지</a></p>
        <p><a href={`${url}:${port_node}/document?docNo=20190401000000001&regId=signer1`}>포탈 호출 생성자 페이지_new</a></p>
        <p><a href={`${url}:${port_node}/document?params={"docId":"190002","regId":"signer1","tmpDocId":"190001","docPath":"${url}:${port_api}/escDoc/pdf/sample.pdf","docName":"테스트.pdf","signers":[{"signerId":"signer1","signerNm":"생성자","signerNo":1},{"signerId":"signer2","signerNm":"유저2","signerNo":2},{"signerId":"signer3","signerNm":"유저3","signerNo":3},{"signerId":"signer4","signerNm":"유저4","signerNo":4},{"signerId":"signer5","signerNm":"유저5","signerNo":5},{"signerId":"signer6","signerNm":"유저6","signerNo":6}]}`}>포탈 호출 생성자 템플릿 페이지</a></p>
        <p><a href={`${url}:${port_node}/document?docNo=20190401000000002&tmpDocNo=20190401000000001&regId=1`}>포탈 호출 생성자 템플릿 페이지_new</a></p>
        <p><a href={'/contract?docNo=20190401000000001&signerNo=1'}>서명자 페이지</a></p>
        <p><a href={'/complete?docNo=20190401000000001&signerNo=1'}>생성자 확인 페이지</a></p>
        <p><a href={`${url}:${port_api}/escDoc/20190401000000001/docSign/1`}>서명자 서명 확인</a></p>
      </div>
    );
  }
}

export default Index;
