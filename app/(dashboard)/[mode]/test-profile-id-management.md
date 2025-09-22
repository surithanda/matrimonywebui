# Profile ID Management Test Cases

## Implementation Summary
The profile ID backup/restore system has been implemented in the layout.tsx with the following features:

### Key Components:
1. **originalProfileIDRef**: useRef to store backup of selectedProfileID
2. **previousModeRef**: useRef to track mode changes
3. **pathname monitoring**: useEffect to detect navigation away from modes
4. **beforeunload handler**: Event listener for page refresh/close scenarios

### Test Scenarios:

#### Scenario 1: Entering createprofile mode
- **Expected**: Original profile ID (e.g., 5) is backed up, selectedProfileID set to 0
- **To Test**: Navigate to `/dashboard/createprofile` from any route with a selected profile
- **Validation**: Console should show backup message and profile ID should be 0

#### Scenario 2: Switching from createprofile to updateprofile
- **Expected**: Original profile ID is restored from backup
- **To Test**: Navigate from `/dashboard/createprofile` to `/dashboard/updateprofile`
- **Validation**: Profile ID should be restored to original value (e.g., 5)

#### Scenario 3: Navigating away from createprofile to other routes
- **Expected**: Original profile ID is restored automatically
- **To Test**: Navigate from `/dashboard/createprofile` to `/dashboard/search` or any other route
- **Validation**: Profile ID should be restored and backup cleared

#### Scenario 4: Page refresh during createprofile mode
- **Expected**: Original profile ID is restored via beforeunload handler
- **To Test**: Refresh page while on `/dashboard/createprofile`
- **Validation**: Profile ID should be restored on page reload

#### Scenario 5: Multiple mode switches
- **Expected**: System handles complex navigation patterns correctly
- **To Test**: createprofile → updateprofile → createprofile → other route
- **Validation**: Original profile ID is maintained throughout and restored at the end

### Console Logging
The implementation includes comprehensive logging for debugging:
- Mode changes detection
- Profile ID backup operations
- Navigation away detection
- Page unload handling
- Restoration operations

### Edge Cases Handled:
1. **Multiple backup attempts**: Only backs up once per session
2. **Navigation without backup**: No restoration if no backup exists
3. **Invalid mode handling**: Proper 404 handling for invalid modes
4. **Component unmounting**: Cleanup in useEffect return functions
5. **Page unload scenarios**: beforeunload event listener

## Testing Instructions:
1. Open browser dev tools to monitor console logs
2. Start with a selected profile (selectedProfileID > 0)
3. Navigate through different test scenarios
4. Verify console logs and actual profile ID values
5. Test edge cases and error scenarios

## Expected Behavior:
- createprofile mode always has selectedProfileID = 0
- Original profile ID is preserved and restored when leaving createprofile
- System handles all navigation patterns gracefully
- No memory leaks or duplicate event listeners
- Proper cleanup on component unmount