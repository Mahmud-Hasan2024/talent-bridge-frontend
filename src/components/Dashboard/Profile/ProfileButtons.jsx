import { Edit, Save, XCircle } from "lucide-react";

const ProfileButtons = ({ isEditing, setIsEditing, isSubmitting }) => {
  return (
    <div className="flex justify-center pt-8">
      {isEditing ? (
        <div className="space-x-4 flex">
          <button
            type="submit"
            className="btn btn-success px-8 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} /> Save Changes
              </>
            )}
          </button>
          <button
            type="button"
            className="btn btn-outline btn-success px-8 text-green-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            onClick={() => setIsEditing(false)}
          >
            <XCircle size={18} /> Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn-success px-10 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
          onClick={() => setIsEditing(true)}
        >
          <Edit size={18} /> Edit Profile
        </button>
      )}
    </div>
  );
};

export default ProfileButtons;
