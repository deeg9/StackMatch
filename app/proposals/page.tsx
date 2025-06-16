import ProposalForm from "./ProposalForm"
import ProposalDashboard from "./ProposalDashboard"
import ProposalSearch from "./ProposalSearch"

const ProposalPage = () => {

  return (
    <div>
      <h1>Proposal System</h1>
      <p>
        This proposal system provides:
        <ul>
          <li>Complete Redux Integration - Uses the existing proposal slice for state management</li>
          <li>
            Multi-tab Proposal Creation - Organized form with Overview, Approach, Timeline & Budget, and Questions tabs
          </li>
          <li>Timeline Builder - Dynamic milestone creation with deliverables and cost breakdown</li>
          <li>File Attachments - Support for portfolio samples and technical documents</li>
          <li>Draft & Submit - Save drafts or submit final proposals</li>
          <li>Management Dashboard - Statistics overview with tabbed organization</li>
          <li>Search & Filter - Advanced filtering capabilities</li>
          <li>Sealed Proposal Support - Privacy protection until reveal date</li>
        </ul>
      </p>
      <ProposalForm />
      <ProposalDashboard />
      <ProposalSearch />
    </div>
  )
}

export default ProposalPage
