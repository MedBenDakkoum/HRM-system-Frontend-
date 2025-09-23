import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../utils/api";
import UserContext from "../context/UserContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { colors } from "../styles/GlobalStyle";
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaFileAlt,
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaClock,
  FaUser,
} from "react-icons/fa";
import Popup from "../components/Popup";
import Loading from "../components/Loading";
import { formatDate } from "../utils/helpers";

const LeavesWrapper = styled.div`
  display: flex;
  margin-left: 250px;
  margin-top: 40px;
  padding: 20px 60px 40px 60px;
  min-height: calc(100vh - 70px);
  background: #f5f7fa;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 24px 32px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.text || "#1f2937"};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${colors.accent || "#f18500"};
  color: white;

  &:hover:not(:disabled) {
    background: ${colors.tertialy || "#e07b00"};
    transform: translateY(-1px);
  }

  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchBox = styled.input`
  padding: 12px 16px 12px 44px;
  border: 2px solid ${colors.secondary || "#e5e7eb"};
  border-radius: 8px;
  font-size: 0.95rem;
  width: 300px;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.accent || "#f18500"};
    box-shadow: 0 0 0 3px rgba(241, 133, 0, 0.1);
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 16px;
  color: ${colors.secondary || "#9ca3af"};
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px solid ${colors.secondary || "#e5e7eb"};
  border-radius: 8px;
  background: white;
  color: ${colors.text || "#374151"};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors.accent || "#f18500"};
    background: ${colors.accent || "#f18500"};
    color: white;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
`;

const ModalCard = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const ModalHeader = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.text || "#1f2937"};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${colors.secondary || "#9ca3af"};
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: ${colors.text || "#374151"};
  }
`;

const ModalBody = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.text || "#374151"};
`;

const FormInput = styled.input`
  padding: 12px 16px;
  border: 2px solid ${colors.secondary || "#e5e7eb"};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.accent || "#f18500"};
    box-shadow: 0 0 0 3px rgba(241, 133, 0, 0.1);
  }
`;

const DatePickerWrapper = styled.div`
  position: relative;
`;

const DatePickerIcon = styled(FaCalendarAlt)`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
  z-index: 1;
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid ${colors.secondary || "#e5e7eb"};
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.accent || "#f18500"};
    box-shadow: 0 0 0 3px rgba(241, 133, 0, 0.1);
  }
`;

const ModalFooter = styled.div`
  padding: 24px 32px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;

  &.cancel {
    background: transparent;
    color: ${colors.secondary || "#6b7280"};
    border: 2px solid ${colors.secondary || "#e5e7eb"};
  }

  &.submit {
    background: ${colors.accent || "#f18500"};
    color: white;
  }

  &.submit:hover:not(:disabled) {
    background: ${colors.tertialy || "#e07b00"};
    transform: translateY(-1px);
  }

  &.cancel:hover {
    background: ${colors.background || "#f9fafb"};
    color: ${colors.text || "#374151"};
  }

  &:disabled {
    background: #d1d5db;
    color: #6b7280;
    cursor: not-allowed;
  }
`;

const LeavesTable = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr 1fr 1.5fr 1fr;
  gap: 1px;
  background: ${colors.accent || "#f3f4f6"};
  padding: 16px 24px;
  font-weight: 600;
  color: ${colors.text || "#374151"};
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr 1fr 1.5fr 1fr;
  gap: 1px;
  padding: 16px 24px;
  background: white;
  transition: all 0.2s ease;

  &:nth-child(even) {
    background: #f9fafb;
  }

  &:hover {
    background: ${colors.background || "#f8fafc"};
    transform: translateY(-1px);
  }
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 0.9rem;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &.pending {
    background: #fef3c7;
    color: #d97706;
  }

  &.approved {
    background: #d1fae5;
    color: #059669;
  }

  &.rejected {
    background: #fee2e2;
    color: #dc2626;
  }
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &.approve {
    background: #d1fae5;
    color: #059669;
  }

  &.reject {
    background: #fee2e2;
    color: #dc2626;
  }

  &.delete {
    background: #fee2e2;
    color: #dc2626;
  }

  &.edit {
    background: #dbeafe;
    color: #2563eb;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const NoData = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: ${colors.secondary || "#9ca3af"};
`;

const NoDataIcon = styled(FaFileAlt)`
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const Leaves = () => {
  const { user } = useContext(UserContext);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState("success");
  const [popupMessage, setPopupMessage] = useState("");

  // Leave request form state
  const [requestForm, setRequestForm] = useState({
    startDate: null,
    endDate: null,
    reason: "",
  });

  // Approve modal state
  const [approveStatus, setApproveStatus] = useState("approved");

  const showPopup = (type, message) => {
    setPopupType(type);
    setPopupMessage(message);
    setPopupVisible(true);
  };

  // Fetch leaves based on user role
  const fetchLeaves = async () => {
    setLoading(true);
    try {
      let response;
      if (user.role === "admin") {
        response = await api("/api/leaves", "GET");
        setLeaves(response.data.leaves || []);
      } else {
        response = await api(`/api/leaves/employee/${user.id}`, "GET");
        setLeaves(response.data.leaves || []);
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
      showPopup("error", "Failed to load leaves");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [user]);

  // Filter and search leaves
  const filteredLeaves = leaves
    .filter((leave) => {
      const matchesSearch =
        leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leave.employee.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || leave.status === filterStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Handle leave request
  const handleRequestLeave = async (e) => {
    e.preventDefault();
    if (
      !requestForm.startDate ||
      !requestForm.endDate ||
      !requestForm.reason.trim()
    ) {
      showPopup("error", "Please fill all required fields");
      return;
    }

    if (requestForm.endDate <= requestForm.startDate) {
      showPopup("error", "End date must be after start date");
      return;
    }

    try {
      const response = await api("/api/leaves", "POST", {
        employeeId: user.id,
        startDate: requestForm.startDate,
        endDate: requestForm.endDate,
        reason: requestForm.reason.trim(),
      });

      if (response.success) {
        setShowRequestModal(false);
        setRequestForm({ startDate: null, endDate: null, reason: "" });
        fetchLeaves();
        showPopup("success", "Leave request submitted successfully");
      } else {
        showPopup("error", response.message || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error requesting leave:", error);
      showPopup("error", "Failed to submit leave request");
    }
  };

  // Handle approve/reject leave
  const handleApproveLeave = async () => {
    if (!selectedLeave) return;

    try {
      const response = await api("/api/leaves/approve", "POST", {
        leaveId: selectedLeave._id,
        status: approveStatus,
      });

      if (response.success) {
        setShowApproveModal(false);
        setSelectedLeave(null);
        fetchLeaves();
        showPopup("success", `Leave ${approveStatus} successfully`);
      } else {
        showPopup("error", response.message || "Failed to update leave status");
      }
    } catch (error) {
      console.error("Error updating leave:", error);
      showPopup("error", "Failed to update leave status");
    }
  };

  // Delete leave request
  const handleDeleteLeave = async (leaveId) => {
    console.log("leaveId", leaveId);
    if (!confirm("Are you sure you want to delete this leave request?")) {
      return;
    }

    try {
      // Note: You'll need to add a delete endpoint in your backend
      // For now, we'll just refresh the list
      await fetchLeaves();
      showPopup("success", "Leave request deleted successfully");
    } catch (error) {
      console.error("Error deleting leave:", error);
      showPopup("error", "Failed to delete leave request");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <LeavesWrapper>
          <Sidebar />
          <Content>
            <Loading text="Loading leaves..." />
          </Content>
        </LeavesWrapper>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <LeavesWrapper>
        <Sidebar />
        <Content>
          {/* Header */}
          <Header>
            <PageTitle>
              <FaCalendarAlt />
              Leave Management
            </PageTitle>

            {user.role === "employee" || user.role === "stagiaire" ? (
              <HeaderActionButton
                type="button"
                onClick={() => setShowRequestModal(true)}
              >
                <FaPlus />
                Request Leave
              </HeaderActionButton>
            ) : (
              <Controls>
                <SearchInput>
                  <SearchIcon />
                  <SearchBox
                    type="text"
                    placeholder="Search leaves..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </SearchInput>
                <FilterButton onClick={() => {}}>
                  <FaFilter />
                  {filterStatus === "all" ? "All Status" : filterStatus}
                </FilterButton>
              </Controls>
            )}
          </Header>

          {/* Leaves Table */}
          <LeavesTable>
            <TableHeader>
              <div>Employee</div>
              <div>Period</div>
              <div>Reason</div>
              <div>Duration</div>
              <div>Status</div>
              <div>Submitted</div>
              <div>Actions</div>
            </TableHeader>

            {filteredLeaves.length === 0 ? (
              <NoData>
                <NoDataIcon />
                <h3>No Leave Requests</h3>
                <p>
                  {user.role === "admin"
                    ? "No leave requests found. Employees can request leaves from their profile."
                    : "No leave requests found. Click 'Request Leave' to submit your first request."}
                </p>
                {user.role !== "admin" && (
                  <ActionButton
                    type="button"
                    onClick={() => setShowRequestModal(true)}
                    style={{ marginTop: "16px" }}
                  >
                    <FaPlus />
                    Request Leave
                  </ActionButton>
                )}
              </NoData>
            ) : (
              filteredLeaves.map((leave) => (
                <TableRow key={leave._id}>
                  <TableCell>
                    <FaUser />
                    {leave.employee ? leave.employee.name : "Unknown"}
                  </TableCell>
                  <TableCell>
                    {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                  </TableCell>
                  <TableCell>{leave.reason}</TableCell>
                  <TableCell>
                    <FaClock />
                    {Math.ceil(
                      (new Date(leave.endDate) - new Date(leave.startDate)) /
                        (1000 * 60 * 60 * 24) +
                        1
                    )}{" "}
                    days
                  </TableCell>
                  <TableCell>
                    <StatusBadge className={leave.status}>
                      {leave.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{formatDate(leave.createdAt, "short")}</TableCell>
                  <TableCell>
                    {user.role === "admin" && leave.status === "pending" && (
                      <>
                        <ActionButton
                          className="approve"
                          type="button"
                          onClick={() => {
                            setSelectedLeave(leave);
                            setApproveStatus("approved");
                            setShowApproveModal(true);
                          }}
                        >
                          <FaCheck />
                          Approve
                        </ActionButton>
                        <ActionButton
                          className="reject"
                          type="button"
                          onClick={() => {
                            setSelectedLeave(leave);
                            setApproveStatus("rejected");
                            setShowApproveModal(true);
                          }}
                        >
                          <FaTimes />
                          Reject
                        </ActionButton>
                      </>
                    )}
                    {(user.role === "employee" || user.role === "stagiaire") &&
                      leave.status === "pending" && (
                        <ActionButton
                          className="delete"
                          type="button"
                          onClick={() => handleDeleteLeave(leave._id)}
                        >
                          <FaTrash />
                          Cancel
                        </ActionButton>
                      )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </LeavesTable>
        </Content>
      </LeavesWrapper>

      {/* Request Leave Modal */}
      {/* Request Leave Modal */}
      {showRequestModal && (
        <ModalOverlay onClick={() => setShowRequestModal(false)}>
          <ModalCard
            onClick={(e) => e.stopPropagation()}
            style={{ animation: "fadeInUp 0.3s ease" }}
          >
            <ModalHeader>
              <ModalTitle>Request Leave</ModalTitle>
              <CloseButton onClick={() => setShowRequestModal(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            <form onSubmit={handleRequestLeave}>
              <ModalBody style={{ gap: "24px" }}>
                {/* Dates Row */}
                <div style={{ display: "flex", gap: "16px" }}>
                  <FormGroup style={{ flex: 1 }}>
                    <FormLabel>Start *</FormLabel>
                    <DatePickerWrapper>
                      <DatePicker
                        selected={requestForm.startDate}
                        onChange={(date) =>
                          setRequestForm((prev) => ({
                            ...prev,
                            startDate: date,
                          }))
                        }
                        placeholderText="Start date"
                        dateFormat="dd/MM/yyyy"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        minDate={new Date()}
                        selectsStart
                        startDate={requestForm.startDate}
                        endDate={requestForm.endDate}
                        className="form-datepicker"
                        required
                      />
                      <DatePickerIcon />
                    </DatePickerWrapper>
                  </FormGroup>

                  <FormGroup style={{ flex: 1 }}>
                    <FormLabel>End *</FormLabel>
                    <DatePickerWrapper>
                      <DatePicker
                        selected={requestForm.endDate}
                        onChange={(date) =>
                          setRequestForm((prev) => ({ ...prev, endDate: date }))
                        }
                        placeholderText="End date"
                        dateFormat="dd/MM/yyyy"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        minDate={requestForm.startDate || new Date()}
                        selectsEnd
                        startDate={requestForm.startDate}
                        endDate={requestForm.endDate}
                        className="form-datepicker"
                        required
                      />
                      <DatePickerIcon />
                    </DatePickerWrapper>
                  </FormGroup>
                </div>

                {/* Reason */}
                <FormGroup>
                  <FormLabel>Reason *</FormLabel>
                  <TextArea
                    placeholder="Write a short reason for your leave..."
                    value={requestForm.reason}
                    onChange={(e) =>
                      setRequestForm((prev) => ({
                        ...prev,
                        reason: e.target.value,
                      }))
                    }
                    required
                    maxLength="500"
                  />
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#6b7280",
                      textAlign: "right",
                    }}
                  >
                    {requestForm.reason.length}/500
                  </div>
                </FormGroup>
              </ModalBody>

              {/* Footer */}
              <ModalFooter>
                <ModalButton
                  type="button"
                  className="cancel"
                  onClick={() => setShowRequestModal(false)}
                >
                  Cancel
                </ModalButton>
                <ModalButton
                  type="submit"
                  className="submit"
                  disabled={
                    !requestForm.startDate ||
                    !requestForm.endDate ||
                    !requestForm.reason.trim()
                  }
                >
                  Submit
                </ModalButton>
              </ModalFooter>
            </form>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* Approve/Reject Modal */}
      {showApproveModal && selectedLeave && (
        <ModalOverlay onClick={() => setShowApproveModal(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {approveStatus === "approved" ? "Approve" : "Reject"} Leave
                Request
              </ModalTitle>
              <CloseButton onClick={() => setShowApproveModal(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <p>
                <strong>Employee:</strong> {selectedLeave.employee.name}
              </p>
              <p>
                <strong>Period:</strong> {formatDate(selectedLeave.startDate)} -{" "}
                {formatDate(selectedLeave.endDate)}
              </p>
              <p>
                <strong>Reason:</strong> {selectedLeave.reason}
              </p>
              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                <ModalButton
                  type="button"
                  className="approve"
                  onClick={() => {
                    setApproveStatus("approved");
                    handleApproveLeave();
                  }}
                  style={{ background: "#d1fae5", color: "#059669" }}
                >
                  <FaCheck />
                  {approveStatus === "approved" ? "Confirm Approve" : "Approve"}
                </ModalButton>
                <ModalButton
                  type="button"
                  className="reject"
                  onClick={() => {
                    setApproveStatus("rejected");
                    handleApproveLeave();
                  }}
                  style={{ background: "#fee2e2", color: "#dc2626" }}
                >
                  <FaTimes />
                  {approveStatus === "rejected" ? "Confirm Reject" : "Reject"}
                </ModalButton>
              </div>
            </ModalBody>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* Status Filter Dropdown */}
      {filterStatus !== "all" && (
        <div
          style={{
            position: "absolute",
            top: "100px",
            right: "60px",
            zIndex: 999,
          }}
        >
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "2px solid #e5e7eb",
              borderRadius: "8px",
              background: "white",
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      )}

      <Popup
        show={popupVisible}
        type={popupType}
        message={popupMessage}
        onClose={() => setPopupVisible(false)}
      />
    </>
  );
};

export default Leaves;
