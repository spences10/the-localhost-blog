import { graphql } from 'gatsby'
import Img from 'gatsby-image'
import React from 'react'
import { isIE } from 'react-device-detect'
import SEO from 'react-seo-component'
import styled from 'styled-components'
import {
  CopyWrapper,
  IndexWrapper,
  PostInfo,
  PostTimeToRead,
  StyledExcerpt,
  StyledLink,
  StyledTitle,
} from '../components/shared'
import { useSiteMetadata } from '../hooks/use-site-metadata'

const PostWrapper = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: var(
    --box-shadow-lg,
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05)
  );
  color: var(
    --colour-on-background,
    ${({ theme }) => theme.colours.grey[900]}
  );
  overflow: hidden;
  &:before {
    height: 5px;
    display: block;
    content: '';
    background: linear-gradient(
      0.25turn,
      var(
        --title-gradient-from,
        ${({ theme }) => theme.colours.primary[200]}
      ),
      var(
        --title-gradient-to,
        ${({ theme }) => theme.colours.primary[500]}
      )
    );
  }
`

const LinkWrapper = styled.div`
  margin: ${({ theme }) => theme.spacing[8]} 0;
  /* padding: 0 ${({ theme }) => theme.spacing[8]}; */
`

const Image = styled(Img)`
  height: ${({ theme }) => theme.spacing[56]};
  object-fit: cover;
`

export default ({ data }) => {
  const {
    description,
    title,
    image,
    siteUrl,
    siteLanguage,
    siteLocale,
    twitterUsername,
  } = useSiteMetadata()
  if (isIE)
    return (
      <IndexWrapper>
        <StyledTitle>IE is not supported.</StyledTitle>
        <StyledExcerpt>
          Please use a modern browser, download Firefox, Chrome or
          Edge
        </StyledExcerpt>
      </IndexWrapper>
    )
  return (
    <>
      <SEO
        title={`Home`}
        titleTemplate={title}
        description={description || `nothin’`}
        image={`${siteUrl}${image}`}
        pathname={siteUrl}
        siteLanguage={siteLanguage}
        siteLocale={siteLocale}
        twitterUsername={twitterUsername}
      />
      <IndexWrapper>
        {/* <Dump data={data}></Dump> */}
        {data.allMdx.nodes.map(
          ({
            id,
            excerpt,
            frontmatter,
            fields: { slug, editLink },
            timeToRead,
          }) => (
            <LinkWrapper key={id}>
              <StyledLink to={slug}>
                <PostWrapper>
                  {!!frontmatter.cover ? (
                    <Image
                      sizes={frontmatter.cover.childImageSharp.sizes}
                      alt={`cover image`}
                    />
                  ) : null}
                  <CopyWrapper>
                    <StyledTitle>{frontmatter.title}</StyledTitle>
                    <PostInfo>
                      <PostTimeToRead>
                        {timeToRead * 2} minutes to read
                      </PostTimeToRead>
                    </PostInfo>
                    <StyledExcerpt>{excerpt}</StyledExcerpt>
                  </CopyWrapper>
                </PostWrapper>
              </StyledLink>
            </LinkWrapper>
          )
        )}
      </IndexWrapper>
    </>
  )
}

export const query = graphql`
  query SITE_INDEX_QUERY {
    allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { private: { eq: false } } }
    ) {
      nodes {
        id
        excerpt(pruneLength: 100)
        frontmatter {
          title
          date(formatString: "YYYY MMMM Do")
        }
        tableOfContents
        timeToRead
        fields {
          slug
          editLink
        }
      }
    }
  }
`
