import ApiFetch from "../ApiFetch";
import apiPath from "../enum/apiPath";

// export async function getDocumentInfo(documentNo: string) {
export async function getDocumentInfo(documentNo: string, tmpDocId: string, userId: string) {
  if(!documentNo) return false;

  // const DOCUMENT_INFO_API_PATH = `${apiPath.CONTRACT.DOCUMENT}/${documentNo}`;
  const DOCUMENT_INFO_API_PATH = `${apiPath.CONTRACT.DOCUMENT}/${documentNo}/${tmpDocId}/${userId}`;
  // console.log('DOCUMENT_INFO_API_PATH = ' + DOCUMENT_INFO_API_PATH);
  const config = {};

  const fetch = new ApiFetch(DOCUMENT_INFO_API_PATH, null, config);
  return fetch.get().then((response : any)=>{    
      return response.data;
    },(error) => { console.log(error) }
  )
}