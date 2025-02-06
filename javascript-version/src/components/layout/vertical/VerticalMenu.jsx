
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { Menu, MenuItem } from '@menu/vertical-menu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

const VerticalMenu = ({ scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const { isBreakpointReached } = useVerticalNav()
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
            className: 'bs-full overflow-y-auto overflow-x-hidden',
            onScroll: container => scrollMenu(container, false)
          }
        : {
            options: { wheelPropagation: false, suppressScrollX: true },
            onScrollY: container => scrollMenu(container, true)
          })}
    >
      <Menu>
        <MenuItem href='/manage-tickets' icon={<i className='ri-ticket-line' />}>
          Manage Tickets
        </MenuItem>
        <MenuItem href='/logout' icon={<i className='ri-logout-box-line' />}>
          Logout
        </MenuItem>
      </Menu>
    </ScrollWrapper>
  )
}

export default VerticalMenu