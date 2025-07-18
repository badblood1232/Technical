import axios from 'axios';

function CancelTripButton({ tripId, onCancelSuccess, disabled }) {
  const handleCancel = async () => {
    if (disabled) return;

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
    <button
      onClick={handleCancel}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? '#ccc' : 'red',
        color: disabled ? '#666' : 'white',
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px'
      }}
    >
      Cancel Trip
    </button>
  );
}

export default CancelTripButton;
