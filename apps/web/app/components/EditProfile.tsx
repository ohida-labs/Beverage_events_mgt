import { Form } from "react-router";
/*Upload photo and Change Common Information */
export default function EditProfile() {
  return (
    <div className="card">
      <div>
        <p>Add a profile!</p>
      </div>
      <Form>
        <div>
          <label>First namme</label>
          <input placeholder="Change First name" />
        </div>

        <div>
          <label>Last namme</label>
          <input placeholder="Change First name" />
        </div>

        <div>
          <label>Phone number</label>
          <input placeholder="Change First name" />
        </div>
      </Form>
    </div>
  );
}
