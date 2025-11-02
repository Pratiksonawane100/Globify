import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";

import { capitialize } from "../lib/utils";
import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFreindsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => outgoingIds.add(req.recipient._id));
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Friends Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Your Friends</h2>
          <Link
            to="/notifications"
            className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-md hover:bg-gray-800 transition"
          >
            <UsersIcon className="w-5 h-5" />
            Friend Requests
          </Link>
        </div>

        {/* Friends List */}
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} darkTheme />
            ))}
          </div>
        )}

        {/* Recommended Users */}
        <section>
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Meet New Learners</h2>
              <p className="text-gray-400 mt-1">
                Discover perfect language exchange partners based on your profile
              </p>
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="p-6 bg-gray-800 rounded-md text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-gray-400">Check back later for new language partners!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div
                    key={user._id}
                    className="bg-gray-800 rounded-xl shadow hover:shadow-lg transition p-5 flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-700">
                        <img
                          src={user.profilePic || "https://i.pravatar.cc/150?u=" + user._id}
                          alt={user.fullName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{user.fullName}</h3>
                        {user.location && (
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <MapPinIcon className="w-3 h-3 mr-1" />
                            {user.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Languages */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                        {getLanguageFlag(user.nativeLanguage)} Native: {capitialize(user.nativeLanguage)}
                      </span>
                      <span className="border border-gray-600 text-gray-200 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                        {getLanguageFlag(user.learningLanguage)} Learning: {capitialize(user.learningLanguage)}
                      </span>
                    </div>

                    {user.bio && <p className="text-gray-400 text-sm mb-3">{user.bio}</p>}

                    {/* Action Button */}
                    <button
                      className={`w-full py-2 rounded-md font-semibold flex items-center justify-center gap-2 ${
                        hasRequestBeenSent ? "bg-gray-700 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
                      } transition`}
                      onClick={() => sendRequestMutation(user._id)}
                      disabled={hasRequestBeenSent || isPending}
                    >
                      {hasRequestBeenSent ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4" />
                          Request Sent
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="w-4 h-4" />
                          Send Friend Request
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
