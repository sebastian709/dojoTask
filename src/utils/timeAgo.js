// utils/timeAgo.js

export const formatLastSeen = (
  timestamp
) => {
  if (!timestamp)
    return "Offline";

  const now = Date.now();

  const diff =
    Math.floor(
      (now - timestamp) / 1000
    );

  // 🔥 ONLINE UNDER 45s
  if (diff < 45) {
    return "Online";
  }

  // 🔥 MINUTES
  const mins = Math.floor(
    diff / 60
  );

  if (mins < 60) {
    return mins === 1
      ? "1m ago"
      : `${mins}mins ago`;
  }

  // 🔥 HOURS
  const hrs = Math.floor(
    mins / 60
  );

  if (hrs < 24) {
    return hrs === 1
      ? "1hr ago"
      : `${hrs}hrs ago`;
  }

  // 🔥 DAYS
  const days = Math.floor(
    hrs / 24
  );

  if (days < 7) {
    return days === 1
      ? "1d ago"
      : `${days}d ago`;
  }

  // 🔥 WEEKS
  const weeks = Math.floor(
    days / 7
  );

  if (weeks < 4) {
    return weeks === 1
      ? "1wk ago"
      : `${weeks}wks ago`;
  }

  // 🔥 MONTHS
  const months = Math.floor(
    days / 30
  );

  if (months < 12) {
    return months === 1
      ? "1mos ago"
      : `${months}mos ago`;
  }

  // 🔥 YEARS
  const years = Math.floor(
    days / 365
  );

  return years === 1
    ? "1yr ago"
    : `${years}yrs ago`;
};