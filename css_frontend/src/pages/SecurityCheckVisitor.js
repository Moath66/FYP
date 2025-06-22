"use client";

import { useEffect, useState } from "react";
import "../styles/SecurityCheckVisitor.css"; // Import the new CSS file

// Import shadcn/ui components (ensure these are installed and configured in your MERN frontend)
// You might need to adjust paths based on your project structure.
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

// Lucide React icons (ensure lucide-react is installed)
import {
  Search,
  Book,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";

// Placeholder for your API functions and ConfirmDialog
// IMPORTANT: Replace these with your actual imports from your MERN backend integration.
// For example:
// import {
//   fetchAllVisitorsForSecurity,
//   approveVisitor,
//   denyVisitor,
// } from "../api/visitorApis";
// import ConfirmDialog from "../components/ConfirmDialog"; // If you still use this for other dialogs

const fetchAllVisitorsForSecurity = async () => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          _id: "1",
          visitorId: "V001",
          visitor_name: "John Doe",
          passport_number: "P12345",
          purpose: "Meeting with CEO",
          phone_number: "123-456-7890",
          email: "john@example.com",
          date: new Date().toISOString(),
          status: "pending",
        },
        {
          _id: "2",
          visitorId: "V002",
          visitor_name: "Jane Smith",
          passport_number: "P67890",
          purpose: "Delivery",
          phone_number: "098-765-4321",
          email: "jane@example.com",
          date: new Date().toISOString(),
          status: "pending",
        },
        {
          _id: "3",
          visitorId: "V003",
          visitor_name: "Alice Johnson",
          passport_number: "P11223",
          purpose: "Interview",
          phone_number: "555-123-4567",
          email: "alice@example.com",
          date: new Date().toISOString(),
          status: "completed",
        },
        {
          _id: "4",
          visitorId: "V004",
          visitor_name: "Bob Williams",
          passport_number: "P44556",
          purpose: "Maintenance",
          phone_number: "777-888-9999",
          email: "bob@example.com",
          date: new Date().toISOString(),
          status: "pending",
        },
      ]);
    }, 1000);
  });
};

const approveVisitor = async (id) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Visitor ${id} approved!`);
      resolve({ success: true });
    }, 500);
  });
};

const denyVisitor = async (id, reason) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Visitor ${id} denied for reason: ${reason}`);
      resolve({ success: true });
    }, 500);
  });
};

const SecurityCheckVisitor = () => {
  const [visitors, setVisitors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [showPurposeBox, setShowPurposeBox] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [confirmApproveData, setConfirmApproveData] = useState(null);
  const [denyData, setDenyData] = useState(null);
  const [reasonText, setReasonText] = useState("");

  const loadVisitors = async () => {
    try {
      setLoading(true);
      const data = await fetchAllVisitorsForSecurity();
      setVisitors(data);
    } catch (err) {
      setError("Failed to fetch visitors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const handleApprove = async (visitor) => {
    setConfirmApproveData({
      message: `Are you sure you want to approve ${visitor.visitor_name} (ID: ${visitor.visitorId}) to enter D'summit Residence?`,
      onConfirm: async () => {
        try {
          await approveVisitor(visitor._id);
          setConfirmApproveData(null);
          loadVisitors();
        } catch (err) {
          alert("Approval failed.");
        }
      },
    });
  };

  const handleDeny = (visitor) => {
    setDenyData(visitor);
  };

  const submitDenial = async () => {
    try {
      await denyVisitor(denyData._id, reasonText);
      setDenyData(null);
      setReasonText("");
      loadVisitors();
    } catch (err) {
      alert("Denial failed.");
    }
  };

  const filtered = Array.isArray(visitors)
    ? visitors.filter((v) =>
        v.visitor_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="security-page-container">
      <Card className="security-card">
        <CardHeader className="security-card-header">
          <CardTitle className="security-card-title">
            <Book className="h-7 w-7" />
            Check Visitors
          </CardTitle>
          <Button variant="outline" className="back-to-dashboard-button">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </CardHeader>
        <CardContent className="security-card-content">
          <div className="search-input-wrapper">
            <Search />
            <Input
              type="text"
              placeholder="Search by visitor name..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="loading-message">Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="table-wrapper">
              <Table className="security-table">
                <TableHeader className="table-header-row">
                  <TableRow>
                    <TableHead className="table-head">#</TableHead>
                    <TableHead className="table-head">Visitor ID</TableHead>
                    <TableHead className="table-head">Visitor Name</TableHead>
                    <TableHead className="table-head">Passport No</TableHead>
                    <TableHead className="table-head">Purpose</TableHead>
                    <TableHead className="table-head">Phone</TableHead>
                    <TableHead className="table-head">Email</TableHead>
                    <TableHead className="table-head">Date</TableHead>
                    <TableHead className="table-head">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length > 0 ? (
                    [...filtered]
                      .sort((a, b) => a.visitorId.localeCompare(b.visitorId))
                      .map((v, i) => (
                        <TableRow key={v._id} className="table-row">
                          <TableCell className="table-cell">{i + 1}</TableCell>
                          <TableCell className="table-cell font-medium">
                            {v.visitorId}
                          </TableCell>
                          <TableCell className="table-cell">
                            {v.visitor_name}
                          </TableCell>
                          <TableCell className="table-cell text-gray-500">
                            {v.passport_number || "-"}
                          </TableCell>
                          <TableCell className="table-cell">
                            <Button
                              variant="outline"
                              className="btn-details"
                              size="sm"
                              onClick={() => {
                                setSelectedPurpose(
                                  v.purpose || "No details provided."
                                );
                                setShowPurposeBox(true);
                              }}
                            >
                              <Info />
                              Details
                            </Button>
                          </TableCell>
                          <TableCell className="table-cell">
                            {v.phone_number}
                          </TableCell>
                          <TableCell className="table-cell">
                            {v.email}
                          </TableCell>
                          <TableCell className="table-cell">
                            {new Date(v.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="table-cell">
                            {v.status === "pending" ? (
                              <div className="action-buttons-container">
                                <Button
                                  className="btn-approve"
                                  size="sm"
                                  onClick={() => handleApprove(v)}
                                >
                                  <CheckCircle />
                                  Approve
                                </Button>
                                <Button
                                  className="btn-deny"
                                  size="sm"
                                  onClick={() => handleDeny(v)}
                                >
                                  <XCircle />
                                  Deny
                                </Button>
                              </div>
                            ) : (
                              <Badge className="status-completed-badge">
                                <CheckCircle />
                                Completed
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="no-visitors-message">
                        No visitors found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Purpose Pop-up (Dialog) */}
      <Dialog open={showPurposeBox} onOpenChange={setShowPurposeBox}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="dialog-title purpose-dialog-title">
              Purpose of Visit
            </DialogTitle>
            <DialogDescription className="dialog-description">
              Details about the visitor's reason for their visit.
            </DialogDescription>
          </DialogHeader>
          <div className="dialog-content-text">
            <p>{selectedPurpose}</p>
          </div>
          <DialogFooter className="dialog-footer">
            <Button
              onClick={() => setShowPurposeBox(false)}
              className="purpose-dialog-close-btn"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Approve Dialog (AlertDialog) */}
      <AlertDialog
        open={!!confirmApproveData}
        onOpenChange={() => setConfirmApproveData(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="dialog-title approve-alert-title">
              Confirm Approval
            </AlertDialogTitle>
            <AlertDialogDescription className="dialog-description">
              {confirmApproveData?.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="dialog-footer">
            <AlertDialogCancel className="approve-alert-cancel-btn">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmApproveData?.onConfirm}
              className="approve-alert-confirm-btn"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Deny Reason Dialog (Dialog) */}
      <Dialog open={!!denyData} onOpenChange={() => setDenyData(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="dialog-title deny-dialog-title">
              Deny Visitor
            </DialogTitle>
            <DialogDescription className="dialog-description">
              <XCircle />
              Enter reason to deny <b>{denyData?.visitor_name}</b> (ID:{" "}
              <b>{denyData?.visitorId}</b>)
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <textarea
              rows="4"
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
              placeholder="Please enter the reason..."
              className="deny-dialog-textarea"
            ></textarea>
          </div>
          <DialogFooter className="dialog-footer">
            <Button
              variant="outline"
              onClick={() => setDenyData(null)}
              className="deny-dialog-cancel-btn"
            >
              Cancel
            </Button>
            <Button onClick={submitDenial} className="deny-dialog-confirm-btn">
              Confirm Denial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecurityCheckVisitor;
