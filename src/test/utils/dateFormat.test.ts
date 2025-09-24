import {
  formatDate,
  formatRelativeTime,
  formatRelativeTimeOld,
} from "../../utils/dateFormat";

describe("formatRelativeTimeOld", () => {
  it("should format very recent dates as 'now'", () => {
    const now = new Date();
    const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000).toISOString();
    const result = formatRelativeTimeOld(thirtySecondsAgo);

    expect(result).toBe("now");
  });

  it("should format dates from a few minutes ago", () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(
      now.getTime() - 5 * 60 * 1000,
    ).toISOString();
    const result = formatRelativeTimeOld(fiveMinutesAgo);

    expect(result).toBe("5 minutes ago");
  });

  it("should format dates from an hour ago", () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const result = formatRelativeTimeOld(oneHourAgo);

    expect(result).toBe("1 hour ago");
  });

  it("should format dates from several hours ago", () => {
    const now = new Date();
    const threeHoursAgo = new Date(
      now.getTime() - 3 * 60 * 60 * 1000,
    ).toISOString();
    const result = formatRelativeTimeOld(threeHoursAgo);

    expect(result).toBe("3 hours ago");
  });

  it("should format dates from a day ago", () => {
    const now = new Date();
    const oneDayAgo = new Date(
      now.getTime() - 24 * 60 * 60 * 1000,
    ).toISOString();
    const result = formatRelativeTimeOld(oneDayAgo);

    expect(result).toBe("1 day ago");
  });

  it("should format dates from several days ago", () => {
    const now = new Date();
    const threeDaysAgo = new Date(
      now.getTime() - 3 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const result = formatRelativeTimeOld(threeDaysAgo);

    expect(result).toBe("3 days ago");
  });

  it("should format dates from a week ago", () => {
    const now = new Date();
    const oneWeekAgo = new Date(
      now.getTime() - 7 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const result = formatRelativeTimeOld(oneWeekAgo);

    expect(result).toBe("1 week ago");
  });

  it("should format dates from several weeks ago", () => {
    const now = new Date();
    const threeWeeksAgo = new Date(
      now.getTime() - 3 * 7 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const result = formatRelativeTimeOld(threeWeeksAgo);

    expect(result).toBe("3 weeks ago");
  });

  it("should format dates from a month ago", () => {
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getTime() - 30 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const result = formatRelativeTimeOld(oneMonthAgo);

    expect(result).toBe("1 month ago");
  });

  it("should format dates from several months ago", () => {
    const now = new Date();
    const threeMonthsAgo = new Date(
      now.getTime() - 3 * 30 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const result = formatRelativeTimeOld(threeMonthsAgo);

    expect(result).toBe("3 months ago");
  });

  it("should format dates from a year ago", () => {
    const now = new Date();
    const oneYearAgo = new Date(
      now.getTime() - 365 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const result = formatRelativeTimeOld(oneYearAgo);

    expect(result).toBe("1 year ago");
  });

  it("should format dates from several years ago", () => {
    const now = new Date();
    const threeYearsAgo = new Date(
      now.getTime() - 3 * 365 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const result = formatRelativeTimeOld(threeYearsAgo);

    expect(result).toBe("3 years ago");
  });

  it("should handle future dates", () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
    const result = formatRelativeTimeOld(futureDate);

    // Future dates are handled as past dates in the current implementation
    expect(result).toBe("now");
  });

  it("should handle invalid date strings", () => {
    const result = formatRelativeTimeOld("invalid-date");

    // Current implementation returns "NaN years ago" for invalid dates
    expect(result).toBe("NaN years ago");
  });
});

describe("formatDate", () => {
  it("should format a valid date", () => {
    const dateString = "2024-01-15T12:00:00Z";
    const result = formatDate(dateString);

    expect(result).toMatch(/15\/01\/2024/);
    // Time may vary according to local timezone
    expect(result).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it("should handle invalid date strings", () => {
    const result = formatDate("invalid-date");

    // Current implementation returns "Invalid Date" for invalid dates
    expect(result).toBe("Invalid Date");
  });
});

describe("formatRelativeTime", () => {
  it("should format very recent dates as 'less than a minute ago'", () => {
    const now = new Date();
    const thirtySecondsAgo = new Date(now.getTime() - 10 * 1000).toISOString();
    const result = formatRelativeTime(thirtySecondsAgo);

    expect(result).toBe("less than a minute ago");
  });

  it("should format very recent dates as '1 minute ago'", () => {
    const now = new Date();
    const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000).toISOString();
    const result = formatRelativeTime(thirtySecondsAgo);

    expect(result).toBe("1 minute ago");
  });

  it("should format dates from a few minutes ago", () => {
    const now = new Date();
    const fiveMinutesAgo = new Date(
      now.getTime() - 5 * 60 * 1000,
    ).toISOString();
    const result = formatRelativeTime(fiveMinutesAgo);

    expect(result).toBe("5 minutes ago");
  });

  it("should format dates from an hour ago", () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
    const result = formatRelativeTime(oneHourAgo);

    expect(result).toBe("about 1 hour ago");
  });

  it("should format dates from several hours ago", () => {
    const now = new Date();
    const threeHoursAgo = new Date(
      now.getTime() - 3 * 60 * 60 * 1000,
    ).toISOString();
    const result = formatRelativeTime(threeHoursAgo);

    expect(result).toBe("about 3 hours ago");
  });

  it("should format dates from a day ago", () => {
    const now = new Date();
    const oneDayAgo = new Date(
      now.getTime() - 24 * 60 * 60 * 1000,
    ).toISOString();
    const result = formatRelativeTime(oneDayAgo);

    expect(result).toBe("1 day ago");
  });

  it("should format dates from several days ago", () => {
    const now = new Date();
    const threeDaysAgo = new Date(
      now.getTime() - 3 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const result = formatRelativeTime(threeDaysAgo);

    expect(result).toBe("3 days ago");
  });

  it("should format dates from a days ago", () => {
    const now = new Date();
    const oneWeekAgo = new Date(
      now.getTime() - 7 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const result = formatRelativeTime(oneWeekAgo);

    expect(result).toBe("7 days ago");
  });

  it("should format dates from several days ago", () => {
    const now = new Date();
    const threeWeeksAgo = new Date(
      now.getTime() - 3 * 7 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const result = formatRelativeTime(threeWeeksAgo);

    expect(result).toBe("21 days ago");
  });

  it("should format dates from a month ago", () => {
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getTime() - 30 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const result = formatRelativeTime(oneMonthAgo);

    expect(result).toBe("about 1 month ago");
  });

  it("should format dates from several months ago", () => {
    const now = new Date();
    const threeMonthsAgo = new Date(
      now.getTime() - 3 * 30 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const result = formatRelativeTime(threeMonthsAgo);

    expect(result).toBe("3 months ago");
  });

  it("should format dates from a year ago", () => {
    const now = new Date();
    const oneYearAgo = new Date(
      now.getTime() - 365 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const result = formatRelativeTime(oneYearAgo);

    expect(result).toBe("about 1 year ago");
  });

  it("should format dates from several years ago", () => {
    const now = new Date();
    const threeYearsAgo = new Date(
      now.getTime() - 3 * 365 * 24 * 60 * 60 * 1000,
    ).toISOString();
    const result = formatRelativeTime(threeYearsAgo);

    expect(result).toBe("almost 3 years ago");
  });

  it("should handle future dates", () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
    const result = formatRelativeTime(futureDate);

    // Future dates are handled as past dates in the current implementation
    expect(result).toBe("in about 1 hour");
  });

  it("should handle invalid date strings", () => {
    const result = formatRelativeTime("invalid-date");

    // Current implementation returns invalid-date for invalid dates
    expect(result).toBe("invalid-date");
  });
});
