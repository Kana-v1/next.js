import PostData from "../../components/post"
import { GetServerSideProps } from "next"


export default function Post({ postID }: { postID: string }) {
  return (
    <PostData postID={postID} />
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {
      postID: params?.id
    }
  }
}