import ApiFetch from "../ApiFetch";
import apiPath from "../enum/apiPath";

export async function setDocumentInfoForSigner(documentNo: number, signerNo: string, data):Promise<object> {
  const DOCUMENT_INFO_API_PATH = `${apiPath.CONTRACT.DOCUMENT}/doc${documentNo}/signer/${signerNo}`;
  const config = {};
  // const config = { headers: {'Authorization': "Bearer " + cookies.get('token')}};

  const fetch = new ApiFetch(DOCUMENT_INFO_API_PATH, data, config);
  return fetch.post().then((response : any)=>{
      return response.data;
    },(error) => { console.log(error) }
  )
}