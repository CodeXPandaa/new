import React from 'react';

const WPRSubmissionForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = React.useState({
    weekNumber: '',
    progressDescription: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ weekNumber: '', progressDescription: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Week Number
        </label>
        <input
          type="number"
          min="1"
          max="52"
          value={formData.weekNumber}
          onChange={(e) => setFormData({ ...formData, weekNumber: e.target.value })}
          required
          placeholder="Enter week number"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Progress Description
        </label>
        <textarea
          value={formData.progressDescription}
          onChange={(e) => setFormData({ ...formData, progressDescription: e.target.value })}
          required
          placeholder="Describe what was accomplished this week..."
          rows="5"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition"
      >
        {loading ? 'Submitting...' : 'Submit WPR'}
      </button>
    </form>
  );
};

export default WPRSubmissionForm;
