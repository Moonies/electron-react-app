import { SvgIcon, SvgIconProps } from '@mui/material'
import { BoxesStackedIcon } from './BoxesStackedIcon'
import { BullsEyeTargetIcon } from './BullsEyeTargetIcon'
import { CoinsIcon } from './CoinsIcon'
import { HandHoldingDollarIcon } from './HandHoldingDollarIcon'
import { MoneyDollarIcon } from './MoneyDollarIcon'

// Define your SVG paths should be namespace depens on /asset/icons
// Define the props for our custom icon component
interface CustomIconProps extends SvgIconProps {
  name: 'moneyDollar' | 'coins' | 'handHoldingDollar' | 'boxesStacked' | 'bullsEyeTarget'
}

const iconMap: Record<CustomIconProps['name'], typeof SvgIcon> = {
  coins: CoinsIcon,
  moneyDollar: MoneyDollarIcon,
  handHoldingDollar: HandHoldingDollarIcon,
  boxesStacked: BoxesStackedIcon,
  bullsEyeTarget: BullsEyeTargetIcon,
}

// Create the CustomIcon component
const CustomIcon: React.FC<CustomIconProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name]
  return <IconComponent {...props} />
}

export default CustomIcon
