/**
 * About portrait: the original photograph, unaltered. CSS frames it to the sitter by
 * trimming the studio margins; the file itself is never modified.
 */
export function ProfilePhoto() {
  return (
    <div className="profile-photo">
      <img src="/profile.jpeg" width={533} height={612} alt="Portrait of Chenjia Zhang in a dark blazer, white shirt and striped tie." decoding="async" />
    </div>
  );
}
