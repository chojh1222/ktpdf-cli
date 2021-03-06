import ApiFetch from "../ApiFetch";
import apiPath from "../enum/apiPath";

export async function getCompleteInfo(documentNo: string, signerNo: string):Promise<object> {
  // const DOCUMENT_INFO_API_PATH = `${apiPath.CONTRACT.DOCUMENT}/doc${documentNo}/signer/${signerNo}`;
  const DOCUMENT_INFO_API_PATH = `${apiPath.CONTRACT.DOCUMENT}/${documentNo}/signComplete/${signerNo}`;
  console.log(DOCUMENT_INFO_API_PATH);
  const config = {};
  // const config = { headers: {'Authorization': "Bearer " + cookies.get('token')}};

  const fetch = new ApiFetch(DOCUMENT_INFO_API_PATH, null, config);
  return fetch.get().then((response : any)=>{
      console.log(response);
      return response.data;
    },(error) => { console.log(error) }
  )
}