import { useState, useEffect } from "react";
import type { User, EventCategory } from "../../utils/eventUtils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface UserPreferencesProps {
  currentUser: User | null;
  updatePreferences: (userId: string, preferences: EventCategory[]) => Promise<void>;
}

const UserPreferences: React.FC<UserPreferencesProps> = ({ currentUser, updatePreferences }) => {
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);

  useEffect(() => {
    if (currentUser?.preferences ){
      setSelectedCategories(currentUser.preferences.split(","));
    }
  }, [currentUser]);

  const handleCategoryChange = (category: EventCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "No user is selected.",
        variant: "destructive",
      });
      return;
    }

    if (!Array.isArray(selectedCategories) || selectedCategories.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one preference.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updatePreferences(currentUser.id, selectedCategories);
      toast({
        title: "Preferences Saved",
        description: "Your event preferences have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating user preferences:", error);
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (!currentUser) return <div className="text-center text-gray-600">No user selected</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">User Preferences</h2>
      <div className="space-y-4">
        {(["Cat 1", "Cat 2", "Cat 3"] as EventCategory[]).map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox
              id={category}
              checked={selectedCategories.includes(category)}
              onCheckedChange={() => handleCategoryChange(category)}
            />
            <Label htmlFor={category} className="text-sm font-medium text-gray-700">
              {category}
            </Label>
          </div>
        ))}
      </div>
      <Button onClick={handleSubmit} className="w-full">
        Save Preferences
      </Button>
    </div>
  );
};

export default UserPreferences;
