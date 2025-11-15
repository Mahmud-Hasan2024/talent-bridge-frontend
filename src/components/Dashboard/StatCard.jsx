const StatCard = ({ icon: Icon, title, value }) => {
  return (
    // Card Background: White (bg-white) with shadow and light green border
    <div className="bg-white rounded-xl shadow-lg p-6 flex items-center space-x-4 border border-green-300 hover:border-green-500 transition duration-300">
      {/* Icon Circle: Retain bold green background */}
      <div className="p-3 bg-green-600 rounded-full text-white shadow-lg shadow-green-600/50">
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <div>
        {/* Title Text: Darker text on light background */}
        <p className="text-sm font-medium text-green-700 uppercase tracking-wider">
          {title}
        </p>
        {/* Value Text: Dark text */}
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;