
import axios from 'axios';

function CancelTripButton({ tripId, onCancelSuccess }) {
  const handleCancel = async () => {
    const confirm = window.confirm('Are you sure you want to cancel this trip?');
    if (!confirm) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:3001/api/trips/${tripId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Trip cancelled successfully.');
      if (onCancelSuccess) onCancelSuccess(); 
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel trip.');
    }
  };

  return (
    <button onClick={handleCancel} style={{ backgroundColor: 'red', color: 'white' }}>
      Cancel Trip
    </button>
  );
}

export default CancelTripButton;
