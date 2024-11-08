export default function Page() {
  return (
    <div className={`relative m-auto h-[350px] w-full max-w-[600px] rounded-[18px] border border-[#55A04B]`}>
      <input type={'file'} accept={'image/*'} multiple className={`absolute inset-0 size-full opacity-0`} />
        <div>hello</div>
    </div>
  )
}
