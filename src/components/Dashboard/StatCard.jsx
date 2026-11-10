const StatCard = ({ icon: Icon, title, value }) => {
  return (
    <div className="bg-base-100 rounded-2xl shadow-sm hover:shadow-md p-6 flex items-center space-x-4 border border-base-300 hover:border-emerald-500/50 transition-all duration-300">
      <div className="p-3.5 bg-emerald-600 rounded-2xl text-white shadow-lg shadow-emerald-600/30">
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <div>
        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-3xl font-black text-base-content mt-0.5">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
