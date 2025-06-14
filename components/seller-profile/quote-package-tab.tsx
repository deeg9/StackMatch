import type React from "react"

type ProposalPackageTabProps = {}

const ProposalPackageTab: React.FC<ProposalPackageTabProps> = () => {
  return (
    <div>
      <h2>Proposal Packages</h2>
      <p>Browse our proposal packages and request a proposal.</p>

      {/* Example Proposal Package */}
      <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
        <h3>Basic Proposal Package</h3>
        <p>This package includes a basic set of services.</p>
        <ul>
          <li>Service 1</li>
          <li>Service 2</li>
        </ul>
        <button>Request Proposal</button>
      </div>

      {/* Example Proposal Package */}
      <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
        <h3>Premium Proposal Package</h3>
        <p>This package includes a comprehensive set of services.</p>
        <ul>
          <li>Service 1</li>
          <li>Service 2</li>
          <li>Service 3</li>
          <li>Service 4</li>
        </ul>
        <button>Request Proposal</button>
      </div>

      {/* Proposal Request Form */}
      <div>
        <h3>Request a Custom Proposal</h3>
        <form>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" />
          <br />
          <br />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" />
          <br />
          <br />

          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description"></textarea>
          <br />
          <br />

          <button type="submit">Submit Proposal Request</button>
        </form>
      </div>
    </div>
  )
}

export default ProposalPackageTab
