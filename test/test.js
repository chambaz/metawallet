const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('MetaWallet', function () {
  let MetaWallet, metaWallet, addr1, addr2, addrs

  beforeEach(async function () {
    ;[addr1, addr2, ...addrs] = await ethers.getSigners()
    MetaWallet = await ethers.getContractFactory('MetaWallet')
    metaWallet = await MetaWallet.deploy()
    metaWallet.deployed()
  })

  it('Should return false claimed status for wallet address', async function () {
    console.log('Checking wallet address', addr1.address)
    expect(await metaWallet.isClaimedWallet(addr1.address)).to.equal(false)
  })

  it('Should return true claimed status for wallet address', async function () {
    console.log('Claiming wallet address', addr1.address)
    await metaWallet.connect(addr1).claimWallet()

    console.log('Checking wallet address', addr1.address)
    expect(await metaWallet.isClaimedWallet(addr1.address)).to.equal(true)
  })

  it('Should return true claimed status for wallet address (admin)', async function () {
    console.log('Admin claiming wallet address', addr1.address)
    await metaWallet.connect(addr1).claimWallet()

    console.log('Checking wallet address', addr1.address)
    expect(await metaWallet.isClaimedWallet(addr1.address)).to.equal(true)
  })

  it('Should return unclaimed wallet address', async function () {
    console.log('Getting unclaimed wallet address', addr1.address)
    const claimedWallet = await metaWallet.getWallet(addr1.address)

    console.log(claimedWallet)
    expect(claimedWallet.exists).to.equal(false)
  })

  it('Should return claimed wallet address', async function () {
    console.log('Claiming wallet address', addr1.address)
    await metaWallet.connect(addr1).claimWallet()

    console.log('Getting claimed wallet address', addr1.address)
    const claimedWallet = await metaWallet.getWallet(addr1.address)

    console.log(claimedWallet)
    expect(claimedWallet.exists).to.equal(true)
  })

  it('Should return all claimed wallet addresses', async function () {
    console.log('Claiming wallet address', addr1.address)
    await metaWallet.connect(addr1).claimWallet()

    console.log('Claiming wallet address', addr2.address)
    await metaWallet.connect(addr2).claimWallet()

    console.log('Manually claiming wallet address', addrs[2].address)
    await metaWallet.connect(addr1).adminClaimWallet(addrs[2].address)

    console.log('Getting all claimed wallet addresses')
    const claimedWallets = await metaWallet.getAllWallets()

    console.log(claimedWallets)
    expect(claimedWallets.length).to.equal(3)
  })

  it('Should update data for claimed wallet address', async function () {
    const walletData = {
      username: 'chambaz',
      bio: 'This is Chambaz Wallet bio...',
      avatar: 'http://www.chambaz.tech',
      links: [
        {
          key: 'twitter',
          value: '@chambaz',
        },
        {
          key: 'instagram',
          value: '@chambaz',
        },
        {
          key: 'linkedin',
          value: '@chambaz',
        },
        {
          key: 'github',
          value: '@chambaz',
        },
      ],
    }

    console.log('Claiming wallet address', addr1.address)
    await metaWallet.connect(addr1).claimWallet()

    console.log('Setting data for wallet address', addr1.address)
    await metaWallet
      .connect(addr1)
      .setWallet(
        walletData.username,
        walletData.bio,
        walletData.avatar,
        walletData.links
      )

    await metaWallet
      .connect(addr1)
      .setWallet(
        walletData.username,
        walletData.bio,
        walletData.avatar,
        walletData.links.slice(0, 3)
      )

    console.log('Getting claimed wallet address', addr1.address)
    const claimedWallet = await metaWallet.getWallet(addr1.address)

    console.log(claimedWallet)
    expect(claimedWallet.username).to.equal(walletData.username)
  })

  it('Should update data for claimed wallet address (admin)', async function () {
    const walletData = {
      username: 'chambaz',
      bio: 'This is Chambaz Wallet bio...',
      avatar: 'http://www.chambaz.tech',
      links: [
        {
          key: 'twitter',
          value: '@chambaz',
        },
        {
          key: 'instagram',
          value: '@chambaz',
        },
        {
          key: 'linkedin',
          value: '@chambaz',
        },
        {
          key: 'github',
          value: '@chambaz',
        },
      ],
    }

    console.log('Claiming wallet address', addr1.address)
    await metaWallet.connect(addr1).claimWallet()

    console.log('Setting data for wallet address', addr1.address)
    await metaWallet
      .connect(addr1)
      .adminSetWallet(
        addr1.address,
        walletData.username,
        walletData.bio,
        walletData.avatar,
        walletData.links
      )

    console.log('Getting claimed wallet address', addr1.address)
    const claimedWallet = await metaWallet.getWallet(addr1.address)

    console.log(claimedWallet)
    expect(claimedWallet.username).to.equal(walletData.username)
  })

  it('Should set claim price', async function () {
    const price = ethers.utils.parseEther('2.4')
    await metaWallet.setClaimPrice(price)
    const getSetPrice = await metaWallet.getClaimPrice()
    expect(price).to.equal(getSetPrice)
  })

  it('Should set update price', async function () {
    const price = ethers.utils.parseEther('1.25')
    await metaWallet.setUpdatePrice(price)
    const getSetPrice = await metaWallet.getUpdatePrice()
    expect(price).to.equal(getSetPrice)
  })

  it('Should set claim price and then attempt to claim with insufficient funds', async function () {
    const claimPrice = ethers.utils.parseEther('2')

    console.log('Setting claim price')
    await metaWallet.setClaimPrice(claimPrice)

    console.log('Claiming wallet address', addr1.address)

    await expect(
      metaWallet
        .connect(addr1)
        .claimWallet({ value: ethers.utils.parseEther('1.5') })
    ).to.be.revertedWith('Not enough ether to claim wallet')
  })

  it('Should set update price and then attempt to update with insufficient funds', async function () {
    const updatePrice = ethers.utils.parseEther('2')
    const walletData = {
      username: 'chambaz',
      bio: 'This is Chambaz Wallet bio...',
      avatar: 'http://www.chambaz.tech',
      links: [
        {
          key: 'twitter',
          value: '@chambaz',
        },
        {
          key: 'instagram',
          value: '@chambaz',
        },
        {
          key: 'linkedin',
          value: '@chambaz',
        },
        {
          key: 'github',
          value: '@chambaz',
        },
      ],
    }

    console.log('Setting update price')
    await metaWallet.setUpdatePrice(updatePrice)

    console.log('Claiming wallet address', addr1.address)
    await metaWallet.connect(addr1).claimWallet()

    await expect(
      metaWallet
        .connect(addr1)
        .setWallet(
          walletData.username,
          walletData.bio,
          walletData.avatar,
          walletData.links,
          { value: ethers.utils.parseEther('1.5') }
        )
    ).to.be.revertedWith('Not enough ether to update wallet')
  })

  it('Should set claim & update price and then attempt to update with sufficient funds', async function () {
    const claimPrice = ethers.utils.parseEther('2')
    const updatePrice = ethers.utils.parseEther('1')
    const walletData = {
      username: 'chambaz',
      bio: 'This is Chambaz Wallet bio...',
      avatar: 'http://www.chambaz.tech',
      links: [
        {
          key: 'twitter',
          value: '@chambaz',
        },
        {
          key: 'instagram',
          value: '@chambaz',
        },
        {
          key: 'linkedin',
          value: '@chambaz',
        },
        {
          key: 'github',
          value: '@chambaz',
        },
      ],
    }

    console.log('Setting claim price')
    await metaWallet.setClaimPrice(claimPrice)

    console.log('Setting update price')
    await metaWallet.setUpdatePrice(updatePrice)

    console.log('Claiming wallet address', addr1.address)
    await metaWallet
      .connect(addr1)
      .claimWallet({ value: ethers.utils.parseEther('2') })

    console.log('Setting data for wallet address', addr1.address)
    await metaWallet
      .connect(addr1)
      .setWallet(
        walletData.username,
        walletData.bio,
        walletData.avatar,
        walletData.links,
        { value: ethers.utils.parseEther('1') }
      )

    console.log('Getting claimed wallet address', addr1.address)
    const claimedWallet = await metaWallet.getWallet(addr1.address)

    console.log(claimedWallet)
    expect(claimedWallet.username).to.equal(walletData.username)
  })
})
