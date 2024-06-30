export default function CreatePostForm() {
  return (
    <div className="self-center">
      <form>
        <div>
          <label htmlFor="name">Post Title</label>
          <input type="text" id="name" />
        </div>
      </form>
    </div>
  );
}
