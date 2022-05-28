import { Button } from '@chakra-ui/react'
import NextLink from 'next/link'

interface ITextButtonLinkProps {
  label: string
  href: string
}

export const TextButtonLink: React.FC<ITextButtonLinkProps> = ({
  label,
  href,
}) => {
  return (
    <NextLink href={href} passHref>
      <Button
        as="a"
        size="xs"
        variant="link"
        colorScheme="gray"
        fontWeight="light"
        data-testid="text-link-button"
      >
        {label}
      </Button>
    </NextLink>
  )
}
