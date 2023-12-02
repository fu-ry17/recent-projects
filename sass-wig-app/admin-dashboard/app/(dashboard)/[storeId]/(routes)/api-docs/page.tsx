import { getApiKeys } from '@/actions/api-key-actions'
import ApiDocsClient from '@/app/__components/api-docs/client'
import Wrapper from '@/app/__components/customs/wrapper'


const ApiDocs = async({ params }: { params: { storeId: string } }) => {
  const apiKeys = await getApiKeys(params.storeId)

  return (
    <Wrapper>
       <ApiDocsClient storeId={params.storeId} apiKeys={apiKeys} />
    </Wrapper>
  )
}

export default ApiDocs