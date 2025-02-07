import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

const CreateCharityEvent = () => {
  const [formData, setFormData] = useState({
    event_name: "",
    event_date: "",
    location: "",
    cause: "",
    target_amount: "",
    donation_link: "",
    organizer_details: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getEmailContentFromAI = async (data) => {
    try {
    const charityeventdata = JSON.stringify(data);
    const aidata = {
        "model": "anthropic-claude-3-5-sonnet",
        "messages": [{
              "content": "create a sympathy email content for a charity with following event details in json" + charityeventdata,
              "role": "user"}],
        "max_tokens": 2000,
        "temperature": 0,
        "top_p": 1,
        "system_instructions": "You are an AI assistant that generates engaging and persuasive email content to encourage donations for charity by bidding interesting inhouse events. Given charity details such as event name, date, location, cause, target amount, and donation link for bidding and donation, create a warm and compelling email that connects emotionally with recipients. Ensure the email has a friendly yet professional tone, a clear call-to-action, and highlights the impact of their donation. Give the output in stringified json format with subject and content in html without any additional information"
      };
      const response = await fetch("http://localhost:5005/api/getEmailContent", {
        method: "POST", // HTTP method
        headers: {
          "Content-Type": "application/json", // JSON content type
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7Im5hbWUiOiJNdXRodSBLdW1hciIsImVtYWlsIjoibXV0aHUua3VtYXJAZnJlc2h3b3Jrcy5jb20iLCJpbWFnZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0lya3VNUzJ1QTJqbF8tT0JGTE82bV9NR2lBdGN1ZVVpRDB6QTE4QWxELW0zWT1zOTYtYyJ9LCJqdGkiOiI4bjdaMnZQRlg5cnpQSm51cGtuQmYiLCJpYXQiOjE3Mzg4Njc5MDksImV4cCI6MTczOTQ3MjcwOX0.XGcIiZwza2I7zgxH2mMtxKbPT8Vd_AlrSUQUKekETtI"
        },
        body: JSON.stringify(aidata), // Convert data to JSON
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json(); // Parse JSON response
      console.log("AI Success:", result);
      const emailContent =  JSON.parse(result.response);

      
      sendEmail(emailContent);
      return result;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };


  const sendEmail = async (data) => {
    try {
    const subject = "Hack For Charity!" + data.subject;
    console.log("email subject",subject);
    console.log("email content",data.content);
      const maildata = {
          "subject": subject,
          "html": data.content,
          "text": "text",
          "accountId": "901390391031",
          "to": [
              {
                  "email": "muthu.kumar@freshworks.com",
                  "name": "Muthu"
              },
              {
                  "email": "vishwakumar.ks@freshworks.com",
                  "name": "Vishwa"
              },
              {
                "email": "sridevivishwa1993@gmail.com",
                "name": "Sridevi"
              }
          ],
          "from": {
              "email": "charity@email-stag.com",
              "name": "Charity",
              "verified": "false"
          }
      }
      const response = await fetch("http://localhost:5005/api/sendEmail", {
        method: "POST", // HTTP method
        headers: {
          "Content-Type": "application/json", // JSON content type
          "Authorization": "FWEM-STAG-9AE328-543.A4ABF5512768D02C2E3566B2E6C990261D8C"
        },
        body: JSON.stringify(maildata), // Convert data to JSON
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json(); // Parse JSON response
      console.log("Mail Success:", result);
      return result;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Charity Event Data:", formData);
    getEmailContentFromAI(formData);
    alert("Charity Event Created Successfully!");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "450px" }}>
        <h3 className="text-center mb-4">Create Charity Event</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Event Name</label>
            <input
              type="text"
              name="event_name"
              className="form-control"
              value={formData.event_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Event Date & Time</label>
            <input
              type="datetime-local"
              name="event_date"
              className="form-control"
              value={formData.event_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              className="form-control"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Cause</label>
            <textarea
              name="cause"
              className="form-control"
              rows="2"
              value={formData.cause}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Target Amount (Rs.)</label>
            <input
              type="number"
              name="target_amount"
              className="form-control"
              value={formData.target_amount}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Donation Link</label>
            <input
              type="url"
              name="donation_link"
              className="form-control"
              value={formData.donation_link}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Organizer Details</label>
            <textarea
              name="organizer_details"
              className="form-control"
              rows="2"
              value={formData.organizer_details}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCharityEvent;
